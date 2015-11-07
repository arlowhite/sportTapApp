System.config({
  transpiler: 'typescript',

  // Use es6 or es5 for SystemJS?
  typescriptOptions: {
    "sourceMap": true,
    "target": "es6"
  },

  paths: {
    'systemjs': 'node_modules/systemjs/dist/system.js',
    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
    'phantomjs-polyfill': 'node_modules/phantomjs-polyfill/bind-polyfill.js',
    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
    'typescript': 'node_modules/typescript/lib/typescript.js',

    'bluebird': 'node_modules/bluebird/js/browser/bluebird.min.js',
    //'faye-websocket': 'node_modules/faye-websocket/lib/faye/websocket.js',
    //'websocket-driver': 'node_modules/websocket-driver/lib/websocket/driver.js',
    //'proxyquire': 'node_modules/proxyquire/index.js',
    //'util': 'node_modules/util/util.js',

    'angular': 'bower_components/angular/angular.min.js',
    'firebase': 'bower_components/firebase/firebase.js',
  },

  defaultJSExtensions: true
});
