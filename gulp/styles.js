'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function () {
  // https://github.com/sass/node-sass#options
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.scss'),
    path.join('!' + conf.paths.src, '/app/index.scss'),
    path.join('!' + conf.paths.src, '/app/**/_*.scss')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  // The Ionic SCSS files to include
  var ionicScssFilenames = [
    // Ionicons
    "ionicons/ionicons.scss",

    // Variables
    "mixins",
    "variables",

    // Base
    "reset",
    "scaffolding",
    "type",

    // Components
    //"action-sheet",
    "backdrop",
    "bar",
    "tabs",
    //"menu",
    //"modal",
    //"popover",
    //"popup",
    "loading",
    //"items",
    //"list",
    "badge",
    //"slide-box",
    "refresher",
    //"spinner",

    // Forms
    //"form",
    //"checkbox",
    //"toggle",
    //"radio",
    //"range",
    //"select",
    //"progress",

    // Buttons
    //"button",
    //"button-bar",

    // Util
    //"grid",
    "util",
    "platform",

    // Animations
    "animations",
    "transitions"];

  var paths = ionicScssFilenames.map(function (name) {
    return '@import "../../bower_components/ionic/scss/' + name + '";';
  });
  var ionicImports = paths.join("\n");

  return gulp.src([
    path.join(conf.paths.src, '/app/index.scss')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe($.replace('// IONIC_IMPORTS', ionicImports))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({ stream: true }));
});
