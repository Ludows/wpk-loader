 var default_opts = {
     "postCss": [require("autoprefixer")({
            "browsers": ["last 5 versions"],
            "flexbox": "no-2009"
          })],
          "processCssUrls": false,
          "terser": {
            "parallel": 8, // Use multithreading for the processing
            "terserOptions": {
              "mangle": true,
              "compress": true // The slow bit
            }
        }
 }

 module.exports = default_opts;