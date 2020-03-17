const fs = require('fs');
const merge = require('deepmerge');
const path = require('path');
const translator = require('./translator');

class Wpk_Helpers {

    static getConfig(opts) {
        console.log('opts', opts);

        if(opts === undefined) {
            opts = {
                recursive: true,
                folders: 'resources',
                mix: 'default',
                plugins: []            
            }
            opts._mixConfig = require('../configs/default');
            opts.extensions = Wpk_Helpers.getSupportedExtensions();
        }
        else {
            opts = merge( require('../config.json'),  opts);
            opts._mixConfig = require('../configs/'+ opts.mix +'');
            opts.extensions = Wpk_Helpers.getSupportedExtensions();
        }

        // return merge( require('../configs/default') ,  opts);

        return opts;

    }
    static getSupportedExtensions() {
        return Object.keys(translator);
    }
    static walker(dir, filelist, recursive) {
        let extensions = Wpk_Helpers.getSupportedExtensions();
        var fs = fs || require('fs'),
        files = fs.existsSync(dir) ? fs.readdirSync(dir) : [],
        filelist = filelist || [];
        let that = this;
        files.forEach(function(file) {
            // console.log('extname', path.extname(file))
            if(recursive != undefined && recursive) {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    filelist = that.walker(path.join(dir, file), filelist, true);
                }
                else {
                    let extname = path.extname(file).substr(1);
                    if(extensions.indexOf(extname) > -1) {
                        filelist.push(path.join(dir, file));
                    }
                }
            }
            else {
                var full_path = path.join(dir, file);
                // if(that.isFile(full_path) === true) {
                    let extname = path.extname(file).substr(1);
                    if(extensions.indexOf(extname) > -1) {
                        filelist.push(full_path);
                    }
                // }

            }

        });
        //  console.log('debug folder recursive', filelist)
        return filelist;
      }
      static isDir(pth) {
        let rt = false;
        var stat = fs.lstatSync(pth);
        if(stat.isDirectory()) {
            rt = true;
        }
        return rt;
      }
      static getFileName(file) {
        let extname = path.extname(file).substr(1);
        var file = path.basename(file,extname);
        return file;
      }
}
module.exports = Wpk_Helpers;