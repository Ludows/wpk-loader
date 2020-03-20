const PluginBase = require('../libs/plugin');
// console.log('PluginBase', PluginBase);
const path = require('path');
const helpers = require('../libs/helpers');
const fs = require('fs');
const potrace = require('potrace')


class PotracePlugin extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    getDefaults() {
        return {
           "folders": [],
           "trace": false,
           "posterize": true,
           "params": {} 
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();
        const self = this;
        const folders = this.options.folders;
        EventManager.on('wpk-loader:end', function() {
            // console.log('prout')
            let pathsList = [];
            folders.forEach((folder) => {
                // console.log('folder dir', folder)
                var links = helpers.walker(path.join(process.cwd(), folder), [], true, ['png', 'gif', 'jpg']);
                // console.log('links', links)
                pathsList = pathsList.concat(links)
            })

            let potraceKeyword = '';

            if(self.options.trace) {
                potraceKeyword = 'trace';
            }

            if(self.options.posterize) {
                potraceKeyword = 'posterize';
            }

            pathsList.forEach((pathLink) => {
                
                potrace[potraceKeyword](pathLink , self.options.params, function() {
                    if (err) throw err;

                    let filename = helpers.getFileName(pathLink);
                    let dir = path.dirname(pathLink);
                    let thePathSVG = path.join(dir, filename+'.svg');

                    fs.writeFileSync(thePathSVG, svg);
                })

            })

        })
    }
}

module.exports = PotracePlugin;