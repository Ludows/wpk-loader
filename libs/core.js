const helpers = require('./helpers');
const colors = require('colors');
const path = require('path');

// console.log('helpers', helpers)
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
        // console.log('folders', folders)
        // console.log('typeof folders', folders instanceof Array)
        let recursive = this.options.recursive;
        if (!folders instanceof Array) {
            console.log('you must provide an array of folders'.red)
            process.exit(1);
        }

        folders.forEach((folder) => {
            // console.log('folder dir', folder)
            var links = helpers.walker(path.join(process.cwd(), folder), [], recursive);
            // console.log('links', links)
            paths = paths.concat(links)
        })
        console.log('paths', paths)
    }
    start() {
        this.prepare();
    }
}
module.exports = Wpk_Core;