const PluginBase = require('../libs/plugin');
console.log('PluginBase', PluginBase)

class MdAssetsAutoload extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();

        EventManager.on('wpk-loader:beforeWorkers', function() {
            console.log('prout')
        })
    }
}

module.exports = MdAssetsAutoload;