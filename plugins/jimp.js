const PluginBase = require('../libs/plugin');
// console.log('PluginBase', PluginBase);
const path = require('path');
const helpers = require('../libs/helpers');
const fs = require('fs');
const Jimp = require('jimp')
const rimraf = require('rimraf');


class ImageManipulationPlugin extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    getDefaults() {
        return {
            type: ['resize', 'compress'],
            entry: path.join(helpers.getPublicPath(), 'images'), // compress
            fileType: ['jpg', 'png'],
            params: {
                quality: 100,
                sizes: [] // array of sizes
            }
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();
        const self = this;
        const manipulations = this.options.type;
        EventManager.once('wpk-loader:beforeWorkers', function () {
            // console.log('prout')
            if (!manipulations instanceof Array) {
                throw new Error('Jimp Plugin needs to have a array of manipulations');
            }

            let pathsList = [];

            var links = helpers.walker(self.options.entry, [], true, self.options.fileType);

            pathsList = pathsList.concat(links)

            for (let index = 0; index < manipulations.length; index++) {
                const manipulation = manipulations[index];

                let manipulationFolder = path.join( self.options.entry , manipulation);

                if (fs.existsSync( manipulationFolder )) {
                    rimraf.sync(manipulationFolder);
                    fs.mkdirSync( manipulationFolder )
                }
                else {
                    fs.mkdirSync( manipulationFolder )
                }

                pathsList.forEach((image) => {

                    let fileType = helpers.getFileType(image);
                    let fileName = helpers.getFileName(image);

                    Jimp.read(image, (err, result) => {
                        if (err) throw err;

                        switch (manipulation) {
                            case 'resize':

                                let sizes = self.options.params.sizes;

                                sizes.forEach((size) => {
                                    let count = size.length;
                                    if (count === 1) {
                                        result
                                            .resize(size[0]) // resize
                                            .quality(100)
                                            .write(path.join(self.options.entry, 'images', manipulation, fileName.substr(0, fileName.length - 1) + '-' + size[0] + '.' + fileType)); // save
                                    } else {
                                        result
                                            .resize(size[0], size[1]) // resize
                                            .quality(100)
                                            .write(path.join(self.options.entry, 'images', manipulation, fileName.substr(0, fileName.length - 1) + '-' + size[0] + 'x' + size[1] + '.' + fileType)); // save
                                    }
                                })
                                break;
                            case 'compress':
                                result.quality(self.options.params.quality) // set JPEG quality
                                result.write(path.join(self.options.entry, 'images', manipulation, fileName.substr(0, fileName.length - 1) + '.' + fileType));
                                break;

                            default:
                                break;
                        }
                    });

                })

            }



        })
    }
}

module.exports = ImageManipulationPlugin;