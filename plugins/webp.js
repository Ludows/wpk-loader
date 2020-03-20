const PluginBase = require('../libs/plugin');
// console.log('PluginBase', PluginBase);
const path = require('path');
const helpers = require('../libs/helpers');
const fs = require('fs');
// const imagemin = require('imagemin')


class WebpPlugin extends PluginBase {
    constructor(name, opts) {
        // console.log('opts', opts)
        super(name, opts);
    }
    getDefaults() {
        return {
           
        }
    }
    run() {
        // console.log('prout')
        const EventManager = this.getEventManager();
        const self = this;

        EventManager.on('wpk-loader:end', function() {
            // console.log('prout')
            

        })
    }
}

module.exports = WebpPlugin;