var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var zip = require('gulp-zip');

// TODO ngAnnotate for DI https://github.com/johnpapa/angular-styleguide#manual-annotating-for-dependency-injection
var paths = {
  sass: ['./scss/app/**/*.scss'],
  material_sass: ['./scss/angular-material/**/*.scss']
};

gulp.task('bump', require('gulp-cordova-bump'));

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/app/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('material_sass', function(done) {
  gulp.src('./scss/angular-material/angular-material.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.material_sass, ['material_sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('phonegap_zip', function(){
  return gulp.src(['./www/**', './config.xml'])
        .pipe(zip('phonegap.zip'))
//        .on('error', swallowError)
        .pipe(gulp.dest('./phonegap/'));
});
