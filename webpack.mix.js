/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

/*------------------------------------------*/
/* Requires                                 */
const mix = require("laravel-mix");
require("laravel-mix-bundle");

/*------------------------------------------*/
/* Mix assets                               */
mix
  .webpackConfig({
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    }
  })
  .setPublicPath("./sample")
  .bundle({ sourceFile: "./sample/src/app.js", outputName: "app" })
  .browserSync({ server: "sample", proxy: null });
