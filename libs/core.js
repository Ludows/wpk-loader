const helpers = require('./helpers');
const colors = require('colors');
const path = require('path');
const mix = require('laravel-mix');
const fs = require('fs');

const events = require('events');
const eventEmitter = new events.EventEmitter();

const PluginBase = require('./plugin');


// const mdassets = require('@ludoows/wpk-loader/mdassets');



// console.log('helpers', helpers)
class Wpk_Core {
    constructor(opts) {
        this.options = helpers.getConfig(opts);
        this.eventManager = eventEmitter;
        helpers.setWpkInstance(this);
    }
    getPlugins() {
        return this.options.plugins;
    }
    getFolders() {
        return this.options.folders;
    }
    prepare() {
        let pathsList = [];
        let folders = this.getFolders();
        // console.log('folders', folders)
        // console.log('typeof folders', folders instanceof Array)
        let recursive = this.options.recursive;
        if (!folders instanceof Array) {
            console.log('you must provide an array of folders'.red)
            process.exit(1);
        }

        folders.forEach((folder) => {
            // console.log('folder dir', folder)
            var links = helpers.walker(path.join(process.cwd(), folder), [], recursive);
            // console.log('links', links)
            pathsList = pathsList.concat(links)
        })
        // console.log('paths', pathsList)
        return pathsList;
    }
    loadPlugins() {
        let plugins = this.getPlugins();
        console.log('plugins', plugins)
        
        plugins.forEach((plugin) => {

            let pathPlugin = helpers.getPluginsPath()

            let pathToPlugin = path.join(pathPlugin, plugin[0]+'.js')

            if(fs.existsSync(pathToPlugin)) {
                let thePlugin = require(pathToPlugin);
                console.log('PluginBase instance of ', thePlugin instanceof PluginBase)
            }
            else {
                console.log('Plugin : '+ plugin[0] +' does\'nt exist'.red)
                process.exit(1);
            }
            // console.log(plugin.hasOwnProperty('run'))
            // console.log(plugin.run)
            // if(!plugin.hasOwnProperty('run')) {
            //     throw new Error('Plugin :'+ plugin +' must have an instance of PluginBaseClass')
            // }
        })
    }
    generate(array) {

        let listForMix = [];
        // Nous restons toujours sur la même logique pour les fichiers css et js.
        // Les fichiers qui auront un underscore ne seront pas process pour le wpk-loader  
        let filtered = array.filter(function(link) {
            let ext = helpers.getFileName(link);
            let firstLetter = ext.charAt(0);
            return firstLetter != '_';
        }) 

        filtered.forEach((linkFiltered) => {
            
            let obj = {
                type : helpers.getFileType(linkFiltered),
                mixFunction: helpers.getMixFunction(linkFiltered),
                destPath: helpers.getDestPath(linkFiltered),
                sourcePath: linkFiltered
            }

            listForMix.push(obj);

        })
        // console.log('listForMix', listForMix)
        return listForMix;
    }
    loadWorker(list) {
        
        let mixInstance = mix;
        mixInstance.options(this.options._mixConfig);

        this.eventManager.emit('wpk-loader:extendOptions', mixInstance);

        if(this.options.enableSourceMaps) {
            if (!mixInstance.inProduction()) {

                mixInstance.webpackConfig({
                    devtool: 'source-map'
                })
                .sourceMaps();
            }
        }
        
        list.forEach((linkObject) => {
            let mixLink;
            mixLink = mixInstance[linkObject.mixFunction](linkObject.sourcePath, linkObject.destPath)
            if(this.options.version) {
                mixLink = mixInstance.version();
            }
        })
        mixInstance.then((stats) => {
            // C'est ici que l'on va créer un event nodejs
            // this.manifestProcess();
            this.eventManager.emit('wpk-loader:end', mixInstance);

       });
    }
    start() {
        this.loadPlugins();
        this.eventManager.emit('wpk-loader:init');
        let prepare = this.prepare();
        this.eventManager.emit('wpk-loader:beforeGenerate');
        let list = this.generate(prepare);
        this.eventManager.emit('wpk-loader:beforeWorkers');
        // this.loadWorker(list);
    }
}
module.exports = Wpk_Core;