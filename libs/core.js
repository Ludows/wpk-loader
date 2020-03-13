const helpers = require('./helpers');

console.log('helpers', helpers)
class Wpk_Core {
    constructor(opts) {
        this.options = helpers.getConfig(opts);
        console.log('this', this)
    }
    start() {
        
    }
}
module.exports = Wpk_Core;