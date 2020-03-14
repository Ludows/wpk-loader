const helpers = require('./helpers');
const colors = require('colors');

console.log('helpers', helpers)
class Wpk_Core {
    constructor(opts) {
        this.options = helpers.getConfig(opts);
    }
    getPlugins() {
        return this.options.plugins;
    }
    getFolders() {
        return this.options.folders;
    }
    prepare() {
        let paths = [];
        let folders = this.getFolders();
        let recursive = this.options.recursive;
        if (typeof folders != 'array') {
            console.log('you must provide an array of folders'.red)
            process.exit(1);
        }

        folders.forEach((folder) => {
            var links = helpers.walker(folders, [], recursive);
            paths.prototype.push.apply(paths, links)
        })
        
    break;
}
start() {
    this.prepare();
}
}
module.exports = Wpk_Core;