const helpers = require('./helpers');

console.log('helpers', helpers)
class Wpk_Core {
    constructor(opts) {
        this.options = helpers.getConfig(opts);
    }
    getPlugins() {
        return this.options.plugins;
    }
    getMode() {
        return this.options.mode;
    }
    getFolders() {
        return this.options.folders;
    }
    prepare() {
        let paths = undefined;
        let mode = this.getMode();
        let folders = this.getFolders();
        let recursive = this.options.recursive;
        switch (mode) {
            case "manual":

                break;

            case "discover":

                break;

            default:
                console.log('The mode "'+mode+'" is undefined.'.red)
                console.log('Modes availables are discover and manual'.underline.red)
                process.exit(1);
                break;
        }
    }
    start() {
        this.prepare();
    }
}
module.exports = Wpk_Core;