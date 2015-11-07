var shell = require("shelljs");
var path = require('path');
var pathExists = require('path-exists')

var moduleName = process.argv[2];

var result = shell.exec('npm show '+moduleName+' main');
var main = result.output;

var p = path.join('node_modules', moduleName, main).trim();
if(!p.endsWith('.js')) {
  p += '.js';
}

console.log(' Path: ', p);
console.log(' Exists: ', pathExists.sync(p));
