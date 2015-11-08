// Karma configuration
// Generated on Tue Nov 03 2015 23:15:11 GMT-0800 (PST)

// Currently not used! Using Mocha for DB tests.

// This supposidly helps load commonjs modules, but not sure it's needed or helpful with node_modules;
//var es6Translate = require('es6-translate');
//var System = require('es6-module-loader').System;
// Tried passing Node's require, but couldn't figure out how to get it to work.
//System.nodeRequire = require;
//es6Translate.patch(System);

// Just went with Mocha for this stuff, which is designed to work with node_modules
//System.import('faye-websocket');
//System.import('proxyquire').then(function (m) {
//  console.log('GOTMOD', m);
//});

//var proxyquire = require('proxyquire');
//console.log('GOT', proxyquire);

//var node_modules = ['websocket-driver'];
var node_modules = ['bluebird', 'faye-websocket', 'proxyquire', 'websocket-driver', 'util'];

var serveFiles = [
  'bower_components/**/*.js',
  //'node_modules/**/*.js.map',
  //'node_modules/bluebird/**/*.js',

  'src/app/**/*.js',
  'src/app/**/*.js.map'
];


//var files = [
  //{pattern: 'src/app/services/*.js', included: false},
  //{pattern: 'src/app/services/*.js.map', included: false},
  //{pattern: 'bower_components/angular/angular.js', included: false},
  //{pattern: 'bower_components/angular-mocks/*.js', included: false},
  //{pattern: 'bower_components/firebase/firebase-debug.js', included: false},
  //{pattern: 'node_modules/bluebird/js/browser/*.js', included: false},
  //{pattern: 'node_modules/faye-websocket/**/*.js', included: false},
  //{pattern: 'node_modules/proxyquire/**/*.js', included: false},
  //{pattern: 'node_modules/assert/assert.js', included: false},
  //{pattern: 'node_modules/util/**/*.js', included: false}
  //'src/app/services/**/*.test.ts'
//];
node_modules.forEach(function (name) {
  serveFiles.push('node_modules/'+name+'/**/*.js');
  serveFiles.push('node_modules/'+name+'/**/*.js.map');
});
//files.push('src/test/karma-requirejs-bootstrap.js');

var nodeRequire = require;

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // I couldn't get requirejs to load node_modules properly with the nodeRequire thing

    // https://github.com/karma-runner/karma-mocha
    frameworks: ['systemjs', 'mocha'],
    // I think this was suggested by outdated docs; doesn't seem necessary.
    //plugins: ['karma-systemjs'],

    systemjs: {
      // Path to your SystemJS configuration file
      configFile: 'src/testing-system.conf.js',

      // Patterns for files that you want Karma to make available, but not loaded until a module requests them. eg. Third-party libraries.
      // I think this is the same thing as files included: false
      serveFiles: serveFiles,

      // SystemJS configuration specifically for tests, added after your config file.
      // Good for adding test libraries and mock modules
      config: {
        paths: {
          'angularMocks': 'bower_components/angular-mocks/angular-mocks.js'
        },

        foo: require
      }
    },

    // list of files / patterns to load in the browser
    // Typescript files have Parse error in Run mode but not Debug mode for some reason.
    files: [
      'src/app/services/*.test.js'
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors:
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // PhantomJS, Chrome
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
