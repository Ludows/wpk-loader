const PluginBase = require('../libs/plugin');
// console.log('PluginBase', PluginBase);
const path = require('path');
const helpers = require('../libs/helpers');
const fs = require('fs');
const rimraf = require('rimraf');

const webp = require('webp-converter');

class WebpPlugin extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    getDefaults() {
        return {
            entry: path.join(helpers.getPublicPath(), 'images'),
            fileType: ['jpg', 'png'], 
            separatedFolder: true,
            param: "-q 80" // please read this documentation for options https://developers.google.com/speed/webp/docs/cwebp
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();
        const self = this;

        EventManager.once('wpk-loader:beforeWorkers', function() {
            // console.log('prout')

            let pathsList = [];

            var links = helpers.walker(self.options.entry, [], true, self.options.fileType);

            pathsList = pathsList.concat(links)

            let webpExport = undefined;

            if(self.options.separatedFolder) {
                webpExport = path.join(self.options.entry, 'webp')

                if (fs.existsSync( webpExport )) {
                    rimraf.sync(webpExport);
                    fs.mkdirSync( webpExport )
                }
                else {
                    fs.mkdirSync( webpExport )
                }
            }

            pathsList.forEach((image) => {
                let fileName = helpers.getFileName(image);

                if(self.options.separatedFolder == false) {
                    webpExport = path.dirname(image);
                }

                webp.cwebp(image, path.join(webpExport, fileName.substr(0, fileName.length - 1)+".webp"), self.options.param ,function(status,error)
                {
                    if(status == '101') {
                        throw new Error(error);
                    }
                    //if conversion successful status will be '100'
                    //if conversion fails status will be '101'
                    // console.log(status,error);	
                });
            })
            
        })
    }
}

module.exports = WebpPlugin;