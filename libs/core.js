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

                if(plugin[1] === undefined) {
                    plugin[1] = {};
                }

                let thePlugin = new (require(pathToPlugin))(plugin[0], plugin[1]);

                console.log('PluginBase instance of ', thePlugin instanceof PluginBase)
                if(!(thePlugin instanceof PluginBase)) {
                    console.log('You are sure you\'re running a plugin ? : '+ plugin[0] +' must extend about the PluginBase Class'.red)
                    process.exit(1);
                }
                thePlugin.setWpkInstance(this); // ici nous récupérons l'instance pour avoir le eventManager
                thePlugin.run();
            }
            else {
                console.log('Plugin : '+ plugin[0] +' does\'nt exist'.red)
                process.exit(1);
            }
        })
    }
    generate(array) {

        let self = this;
        let listForMix = [];
        // Nous restons toujours sur la même logique pour les fichiers css et js.
        // Les fichiers qui auront un underscore ne seront pas process pour le wpk-loader  
        let filtered = array.filter(function(link) {
            let ext = helpers.getFileName(link);
            let firstLetter = ext.charAt(0);
            return firstLetter != '_';
        }) 

        filtered.forEach((linkFiltered) => {
            
            let isWorker = self.options.sw != false && self.options.sw.length > 0 && linkFiltered.includes(self.options.sw);
            
            let obj = {
                type : helpers.getFileType(linkFiltered),
                mixFunction: helpers.getMixFunction(linkFiltered),
                destPath: isWorker ? path.join( helpers.getPublicPath(), self.options.sw) : helpers.getDestPath(linkFiltered),
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
        this.loadWorker(list);
    }
}
module.exports = Wpk_Core;