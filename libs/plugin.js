const helpers = require('./helpers');
class Wpk_PluginBase {
    constructor(name, opts) {
        this.name = name;
        this.options = helpers.mergeConfig(this.getDefaults(), opts);
    }
    getDefaults() {
        return {};
    }
    setWpkInstance(wpkInstance) {
        this._wpk = wpkInstance;
    }
    getWpkInstance() {
        return this._wpk;
    }
    getEventManager() {
        return this._wpk.eventManager;
    }
    run() {
        // this method is called 
        // And so magic here..
        return this;
    }
}
module.exports = Wpk_PluginBase;