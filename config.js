// const MDAssets = require('./plugins/mdassets')

const baseConfiguration = {
    "recursive": true,
    "autoload": false,
    "version": true,
    "enableSourceMaps": true,
    "folders": [
        "/resources/"
    ],
    "excludeFolders": [],
    "outputFolder" : "public",
    "mix": "default",
    "plugins": [
        ['mdassets', {'file': 'mdassets-autoload.json', 'destPath': 'public'}]
    ]
}

module.exports = baseConfiguration;