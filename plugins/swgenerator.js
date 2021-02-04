const PluginBase = require('../libs/plugin');
// console.log('PluginBase', PluginBase);
const path = require('path');
const helpers = require('../libs/helpers');
const fs = require('fs');
const generateServiceWorkers = require('generate-service-worker');


class SwGeneratorPlugin extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    getDefaults() {
        return {
            cache: {
              offline: true,
              precache: [],
              strategy: [{
                type: 'prefer-cache',
                matches: ['\\.js']
              }],
            }
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();
        const self = this;
        EventManager.once('wpk-loader:end', function() {
            // console.log('prout')
            
            const serviceWorkers = generateServiceWorkers(this.options);

            let link = path.join(helpers.getPublicPath(), 'sw.js');

            fs.writeFileSync(link, JSON.stringify(serviceWorkers, null, 2));
        })
    }
}

module.exports = SwGeneratorPlugin;