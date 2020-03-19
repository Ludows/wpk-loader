const PluginBase = require('../libs/plugin');
console.log('PluginBase', PluginBase)

class MdAssetsAutoload extends PluginBase {
    constructor(opts) {
        console.log('opts', opts)
        super('mdassets', opts);
    }
    run() {
        console.log('prout')
    }
}

module.exports = MdAssetsAutoload;