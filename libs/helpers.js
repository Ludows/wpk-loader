const fs = require('fs');
const merge = require('deepmerge');
const path = require('path');
const translator = require('./translator');

class Wpk_Helpers {

    static getConfig(opts) {
        console.log('opts', opts);

        if(opts === undefined) {
            opts = require('../config.js')
            opts._mixConfig = require('../configs/default');
            opts.extensions = Wpk_Helpers.getSupportedExtensions();
        }
        else {
            opts = merge( require('../config.js'),  opts);
            opts._mixConfig = require('../configs/'+ opts.mix +'');
            opts.extensions = Wpk_Helpers.getSupportedExtensions();
        }

        // return merge( require('../configs/default') ,  opts);

        return opts;

    }
    static getSupportedExtensions() {
        return Object.keys(translator.extensions);
    }
    static walker(dir, filelist, recursive, overrideExtensions = []) {
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
                    if(extensions.indexOf(extname) > -1 && overrideExtensions.length === 0) {
                        filelist.push(path.join(dir, file));
                    }

                    if(overrideExtensions.indexOf(extname) > -1 && overrideExtensions.length > 0) {
                      filelist.push(path.join(dir, file));
                    }
                    
                }
            }
            else {
                var full_path = path.join(dir, file);
                // if(that.isFile(full_path) === true) {
                    let extname = path.extname(file).substr(1);
                    if(extensions.indexOf(extname) > -1 && overrideExtensions.length === 0) {
                        filelist.push(path.join(dir, file));
                    }

                    if(overrideExtensions.indexOf(extname) > -1 && overrideExtensions.length > 0) {
                      filelist.push(path.join(dir, file));
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
      static getFile(file) {
        var file = path.basename(file);
        return file;
      }
      static getFileType(file) {
        let extname = path.extname(file).substr(1);
        return extname;
      }
      static getMixFunction(file) {
        let extname = path.extname(file).substr(1);
        return translator.mix[extname];
      }
      static setWpkInstance(instance) {
        Wpk_Helpers.instance = instance;
      }
      static getWpkInstance() {
          return Wpk_Helpers.instance;
      }
      static getDestPath(file) {
        //   console.log('getDestPath', file) 
          let destPath = undefined;

        //   let basePath = Wpk_Helpers.getBasePath();
          let instance = Wpk_Helpers.getWpkInstance();

          let parsedDir = path.dirname(file);
          let ext = Wpk_Helpers.getFileType(file);
          let File = Wpk_Helpers.getFile(file);
        //   console.log('instance', instance)

          for (let index = 0; index < instance.options.folders.length; index++) {
              const folder = instance.options.folders[index];
              if(parsedDir.indexOf(folder) > -1) {
                parsedDir = parsedDir.replace(folder, path.sep+instance.options.outputFolder+path.sep);

                if(translator.needChange[ext]) {
                    

                    let extension_for_folder = translator.extensions[ext];

                    let predictedFolders = translator.predictedFolders[extension_for_folder];
                    // console.log('predictedFolders', predictedFolders)
                    // console.log('ext', ext)

                    for (let k = 0; k < predictedFolders.length; k++) {
                        const predictedFolder = predictedFolders[k];
                        if(parsedDir.indexOf(predictedFolder) > -1) {
                            parsedDir = parsedDir.replace(predictedFolder, extension_for_folder);
                            break;
                        }
                        
                    }

                    const reg = new RegExp(ext, 'g');
                    // console.log('reg', reg)

                    File = File.replace(reg, extension_for_folder);
                }

                destPath = path.join(parsedDir, File);

                // console.log('destPath', destPath)

                break;
              }
              
          }
          return destPath;

      }
      static getBasePath() {
          return process.cwd();
      }
      static getPackageName() {
        return '@ludoows/wpk-loader';
      }
      static getPluginsPath() {
        return path.join(Wpk_Helpers.getBasePath(), 'node_modules',  Wpk_Helpers.getPackageName(), 'plugins')
      }
      static getPublicPath() {
        return path.join(Wpk_Helpers.getBasePath(), 'public');
      }
      static mergeConfig(obj, objtwo) {
        return merge(obj, objtwo);
      }
      static getMDAssets() {
        let mdFile = path.join(Wpk_Helpers.getPublicPath(), 'mdassets-autoload.json');
        let rawData = fs.readFileSync(mdFile);
        let mixJson = JSON.parse(rawData);

        return mixJson;
      }
}
module.exports = Wpk_Helpers;