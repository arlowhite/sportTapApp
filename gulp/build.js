'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var zip = require('gulp-zip');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'sportTap',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

gulp.task('fonts-ionicons', function () {
  return gulp.src('bower_components/ionic/release/fonts/**/*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/ionicons/')));
});

gulp.task('fonts-robotodraft', function () {
  return gulp.src('bower_components/robotodraft/fonts/**/*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/robotodraft/')));
});

gulp.task('fonts', ['fonts-ionicons', 'fonts-robotodraft']);

gulp.task('assets', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src(path.join(conf.paths.src, '/assets/**/*'))
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/')));
});

gulp.task('clean', function (done) {
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('build', ['html', 'fonts', 'assets']);

gulp.task('phonegap_zip', function(){
  return gulp.src([path.join(conf.paths.dist, '/**/*'), 'config.xml'])
        .pipe(zip('phonegap.zip'))
//        .on('error', swallowError)
        .pipe(gulp.dest('phonegap/'));
});
