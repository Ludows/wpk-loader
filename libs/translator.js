const translator = {
    extensions: {
        js: 'js',
        scss: 'css',
        sass : 'css',
        less: 'css',
        stylus: 'css',
        ts: 'js',
        jsx: 'js'
    },
    mix: {
        js: 'js',
        scss: 'sass',
        sass : 'sass',
        less: 'less',
        stylus: 'stylus',
        ts: 'ts',
        jsx: 'react'
    },
    needChange: {
        js: false,
        scss: true,
        sass : true,
        less: true,
        stylus: true,
        ts: true,
        jsx: true
    }  
}

module.exports = translator;