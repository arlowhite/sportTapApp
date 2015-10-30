'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

// Note: Angular Material SASS needs to be compiled separately because Ionic variables conflict
gulp.task('material-css', function () {
  // https://github.com/sass/node-sass#options
  var sassOptions = {
    style: 'expanded'
  };

  return gulp.src([
    path.join(conf.paths.src, '/angular-material/angular-material.scss')
  ])
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({ stream: true }));
});
