let env = process.env.NODE_ENV 
 
 var default_opts = {
   "postCss": [require("autoprefixer")({
     "overrideBrowserslist": ["last 5 versions"],
     "flexbox": "no-2009"
   })],
   "processCssUrls": false,
   "purifyCss": env === 'production' ? true : false,
   "terser": {
     "parallel": 8, // Use multithreading for the processing
     "terserOptions": {
       "mangle": true,
       "compress": true // The slow bit
     }
   },

 }

 module.exports = default_opts;