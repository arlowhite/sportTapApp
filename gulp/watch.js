'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

var devMode = argv.dev;
var watchDeps = ['inject'];
if (!devMode) {
  // webpack watcher
  watchDeps.push('scripts:watch');
}

gulp.task('watch', watchDeps, function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.scss')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/angular-material/**/*.scss'), ['material-css']);

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });

  if (devMode) {
    // scripts:watch (webpack watcher) not active
    // Currently tsc recompiles all JS files every time, so just watch the main one
    gulp.watch(path.join(conf.paths.src, '/app/index.module.js'), function (event) {
      browserSync.reload(event.path);
    });
  }

});
