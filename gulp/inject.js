'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var devMode = argv.dev;

var injectDeps = ['styles'];

if (argv.materialCss) {
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

  var injectScripts;
  if (!devMode) {
    injectScripts = gulp.src([
      path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
      path.join(conf.paths.tmp, '/serve/app/**/*.js'),
      path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
      path.join('!' + conf.paths.src, '/app/**/*.mock.js')
    ], {read: false});
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
    work = work.pipe($.inject(injectScripts, injectOptions));
  }

  work = work
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));

  return work;
});
