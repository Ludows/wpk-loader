const fs = require('fs');
const merge = require('deepmerge');

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
    static walker(dir, filelist, recursive) {
        var fs = fs || require('fs'),
        files = fs.existsSync(dir) ? fs.readdirSync(dir) : [],
        filelist = filelist || [];
        let that = this;
        files.forEach(function(file) {
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
}
module.exports = Wpk_Helpers;