/**
 * Karma requirejs bootstrap.
 * Had difficult getting node_modules with deps required.
 * Tried karma-commonjs and karma-commonjs-plus
 *
 * Also, got context _ error often.
 * Decided to just go with SystemJS.
 *
 * @type {requirejs|exports|module.exports}
 */

var requirejs = require('requirejs');

var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

requirejs.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  /*
  The assert is brittle, but I'm not sure how you're supposed to get Node's assert in Karma.
   */
  //paths: {
  //  'assert': 'node_modules/assert/assert',
  //  'angular': 'bower_components/angular/angular',
  //  'firebase': 'bower_components/firebase/firebase-debug',
  //  'angularMocks': 'bower_components/angular-mocks/angular-mocks',
  //  'bluebird': 'node_modules/bluebird/js/browser/bluebird',
  //  'faye-websocket': 'node_modules/faye-websocket/lib/faye/websocket',
  //  //'proxyquire': 'node_modules/proxyquire/lib/proxyquire',
  //  //'util': 'node_modules/util/util',
  //  //'websocket-driver': ''
  //},

  //packages: ['node_modules/proxyquire', 'node_modules/util', 'node_modules/assert'],
  //
  //shim: {
  //  'angular': {
  //    exports: 'angular'
  //  },
  //
  //  'angularMocks': {
  //    exports: 'inject',
  //    deps: ['angular']
  //  },
  //
  //  'firebase': {
  //    exports: 'Firebase'
  //  },
  //
  //  //'proxyquire': {
  //  //  deps: ['assert']
  //  //},
  //  //
  //  //'faye-websocket': {
  //  //  deps: ['assert']
  //  //},
  //  //
  //  //'assert': {
  //  //  deps: ['util'],
  //  //  exports: 'assert'
  //  //}
  //},

  nodeRequire: require,

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
