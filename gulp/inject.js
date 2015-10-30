'use strict';

var path = require('path');
var pathExists = require('path-exists');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;
var del = require('del');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var devMode = argv.dev;

var injectDeps = [];

var servePathIndexCss = path.normalize(path.join(__dirname, '..',
  conf.paths.tmp, '/serve/app/index.css'));
var servePathMaterialCss = path.normalize(path.join(__dirname, '..',
  conf.paths.tmp, '/serve/app/angular-material.css'));
var servePathIndexJS = path.normalize(path.join(__dirname, '..',
  conf.paths.tmp, '/serve/app/index.module.js'));

var stylesCssExists = pathExists.sync(servePathIndexCss);
if (argv.styles || !stylesCssExists) {
  injectDeps.push('styles');
}

var materialCssExists = pathExists.sync(servePathMaterialCss);
if (argv.materialCss || !materialCssExists) {
  if (!materialCssExists) {
    console.info('angular-material.css missing, adding to tasks.');
  }
  injectDeps.push('material-css');
}
if (!devMode) {
  injectDeps.push('scripts');
}

gulp.task('inject', injectDeps, function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  if (devMode) {
    // Make sure js file isn't under .tmp, which would serve the wrong file for --dev mode
    if (pathExists.sync(servePathIndexJS)) {
      console.warn(servePathIndexJS + ' exists in --dev mode, removing!');
      del([servePathIndexJS]);
    }
  }

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  // injects into index.html and writes to .tmp/serve
  var work = gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions));

  // js will only be generated under .tmp without --dev
  if (!devMode) {
    var injectScripts = gulp.src([
      path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
      path.join(conf.paths.tmp, '/serve/app/**/*.js'),
      path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
      path.join('!' + conf.paths.src, '/app/**/*.mock.js')
    ], {read: false});
    work = work.pipe($.inject(injectScripts, injectOptions));
  }

  work = work
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));

  return work;
});
