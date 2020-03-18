const MDAssets = new (require('./plugins/mdassets'))({
    'file': 'mdassets-autoload.json',
    'destPath': 'public'
 });
 
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
         MDAssets
     ]
 }
 
 module.exports = baseConfiguration;