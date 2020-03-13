class Wpk_PluginBase {
    constructor(name, wpkLoaderInstance) {
        this.name = name;
        this._wpk = wpkLoaderInstance;
    }
    getWpkInstance() {
        return this._wpk;
    }
    run() {
        // this method is called 
        // And so magic here..
        return this;
    }
}
module.exports = Wpk_PluginBase;