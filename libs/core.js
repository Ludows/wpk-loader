const helpers = require('./helpers');
class Wpk_Core {
    constructor(opts) {
        this.options = helpers.getConfig(opts);
    }
}
module.exports = Wpk_Core;