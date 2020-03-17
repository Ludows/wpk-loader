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
        }
        else {
            opts = merge( require('../config.json'),  opts);
            opts._mixConfig = require('../configs/'+ opts.mix +'');
        }

        // return merge( require('../configs/default') ,  opts);

        return opts;

    }
    static getSupportedExtensions() {
        return Object.keys(translator);
    }
    static walker(dir, filelist, recursive) {
        var fs = fs || require('fs'),
        files = fs.existsSync(dir) ? fs.readdirSync(dir) : [],
        filelist = filelist || [];
        let that = this;
        files.forEach(function(file) {
            console.log('extname', path.extname(file))
            if(recursive != undefined && recursive) {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    filelist = that.walker(path.join(dir, file), filelist, true);
                }
                else {
                    filelist.push(path.join(dir, file));
                }
            }
            else {
                var full_path = path.join(dir, file);
                if(that.isFile(full_path) === true) {
                    filelist.push(path.join(dir, file));
                }

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
      static isFile(str) {
        let rt = false;
        // // console.log('isFile debug', str)
        var fileSpl = str.replace(/\\/g, '/').split('/');
        var filetoTest = fileSpl[fileSpl.length - 1];
        // console.log('file to test', filetoTest)
        if(filetoTest.endsWith('.js') || filetoTest.endsWith('.sass') || filetoTest.endsWith('.scss')) {
            rt = true;
        }
        return rt;
      }
}
module.exports = Wpk_Helpers;