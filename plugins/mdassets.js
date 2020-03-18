const PluginBase = require('../libs/plugin');

class MdAssets extends PluginBase {
    constructor(opts) {
        console.log('opts', opts)
        super('mdassets', opts);
    }
    run() {

    }
}

module.exports = MdAssets;