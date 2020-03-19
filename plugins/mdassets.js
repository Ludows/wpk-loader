const PluginBase = require('../libs/plugin');
// console.log('PluginBase', PluginBase);
const path = require('path');
const helpers = require('../libs/helpers');
const fs = require('fs');

class MdAssetsAutoload extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    getDefaults() {
        return {
            'file': 'mdassets-autoload.json', 
            'destPath': 'public',
            'jsonIndentation': 2        
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();
        const self = this;

        EventManager.on('wpk-loader:end', function() {
            // console.log('prout')
            let mixManifest = path.join(helpers.getPublicPath(), 'mix-manifest.json');

            let rawData = fs.readFileSync(mixManifest);
            let mixJson = JSON.parse(rawData);
            // console.log('mixJson', mixJson)

            let MDAssetsJson = {};

            let mixJsonKeys = Object.keys(mixJson);

            mixJsonKeys.forEach((key) => {
                // console.log(path.dirname(key))

                let fileType = helpers.getFileType(key);
                let fileName = helpers.getFileName(key);

                if(fileName.indexOf('.min') > - 1) {
                    // ca existe et on s'en bat la bite des .min
                    fileName = fileName.replace('.min', '');
                }

                // console.log('fileType', fileType)

                // C'est complètement débile de faire le process pour des fichiers maps. Ces fichiers sont appelés a la fin de la feuille de style générée.
                if(fileType != 'map') {
                    let getTypeFolderConfiguration = self.getTypeFolderConfiguration(key);
                    // console.log('getTypeFolderConfiguration', getTypeFolderConfiguration)
                    let bindingKey = undefined;

                    if(getTypeFolderConfiguration != null) {
                        bindingKey = getTypeFolderConfiguration+'.'+fileType+'.'+fileName
                    }
                    else {
                        bindingKey = fileType+'.'+fileName
                    }
                    
                    MDAssetsJson[bindingKey] = {
                        "file" : key,
                        "hash": self.getHash(mixJson[key])
                    }
                    
                    // console.log(bindingKey)
                }

                // let dirname = path.dirname(key).split()
            })

            let pathConfigDest = path.join(helpers.getBasePath(), self.options.destPath, self.options.file)

            if(fs.existsSync(pathConfigDest)) {
                // on retire le fichier
                fs.unlinkSync(pathConfigDest);
                //on recrée le fichier
                fs.writeFileSync(pathConfigDest, JSON.stringify(MDAssetsJson, null, self.options.jsonIndentation));
            }
            else {
                fs.writeFileSync(pathConfigDest, JSON.stringify(MDAssetsJson, null, self.options.jsonIndentation));
            }


        })
    }
    getHash(str) {
        let strSpl = str.split('?id=');
        return strSpl[strSpl.length - 1];
    }
    getTypeFolderConfiguration(file) {
        let ret = null;
        if(file.indexOf('/common/') > -1) {
            ret = 'common';
        }

        if(file.indexOf('/front/') > -1) {
            ret = 'front';
        }

        if(file.indexOf('/back/') > -1) {
            ret = 'back';
        }

        return ret;
    }
}

module.exports = MdAssetsAutoload;