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
            'ignoreMap': true
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();

        EventManager.on('wpk-loader:end', function() {
            console.log('prout')
            let mixManifest = path.join(helpers.getPublicPath(), 'mix-manifest.json');

            let rawData = fs.readFileSync(mixManifest);
            let mixJson = JSON.parse(rawData);
            console.log('mixJson', mixJson)
        })
    }
}

module.exports = MdAssetsAutoload;