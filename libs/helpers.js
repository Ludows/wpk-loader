const fs = require('fs');
const merge = require('deepmerge');

class Wpk_Helpers {
    static getConfig(opts) {
        console.log('opts', opts);

        if(opts === undefined) {
            opts = {
                recursive: true,
                mode: 'discover',
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
}
module.exports = Wpk_Helpers;