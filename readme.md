# Wpk-loader Guide

WARNING This package is still under development.

- [Installation](#installation)
- [Options](#options)
- [Plugins](#plugins)
- [Events](#events)
- [Todo](#todo)


## Installation

Hello everyone, here is a simple packet in order to be able to further extend this fabulous npm packet, Laravel Mix.

wpk-loader at its base, will allow you to autogenerate your assets. We will see together how to install it.


```
npm install @ludoows/wpk-loader
```

This package will install the required Laravel Mix and Cross-env packages for you.

After installing this package, please add the following lines to it in the following file: webpack.mix.js

```js
let WebpackConfigLoader = require('@ludoows/wpk-loader');

let wpk = new WebpackConfigLoader({})

wpk.start()
```

## Options

Wpk-loader is a fully customizable tool. You can simply pass these different options as an argument.

```js
let WebpackConfigLoader = require('@ludoows/wpk-loader');

let wpk = new WebpackConfigLoader({
    "recursive": true, // tell how you want to crawl your ressources
    "version": true, // tell you to enable versionning
    "enableSourceMaps": true, // enable sourcemap or not
    "sw" : "name_of_your_service_worker" // tell how to work with your custom service worker with Wpk-loader.
    "folders": [
        "/resources/" // folders entries
    ],
    "excludeFolders": [], // folders to exclude 
    "outputFolder" : "public", // the output path
    "mix": "default", // the default configuration for mix. You can create your mix configuration
    "plugins": [
        ['mdassets', {'file': 'mdassets-autoload.json', 'destPath': 'public'}]
    ] // tels which plugins to init for wpk-loader
})

wpk.start()
```

WARNING You cannot currently add new wpk-loader plugins. This will soon improve..


## Events

Wpk-loader embeds with it, an event manager. You can listen to several steps until the final generation of the assets.

```
wpk-loader:init

wpk-loader:beforeGenerate

wpk-loader:beforeWorkers

wpk-loader:end
```

## Plugins

Wpk-loader comes with a whole bunch of plugins available.

- webp.js => This package allows to create webp according to bitmap sources.
- potrace.js => This package allows to generate svg according to bitmap sources.
- jimp.js => This package allows you to compress or size your images according to bitmap sources.

## Todo

- Add the ability to auto generate a service worker with workbox.