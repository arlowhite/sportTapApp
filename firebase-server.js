var FirebaseServer = require('firebase-server');
var fs = require("fs");

var port = 5000;
var hostname = 'localhost.firebaseio.com';

var SECRET = 'MYSECRET123';
//var generate_token_with_uid = 'unit-testing';

var server = new FirebaseServer(port, hostname + ':' + port, {
  /* You can put your initial data model here, or just leave it empty */
});

var rules = fs.readFileSync("src/firebase-rules.json");
server.setRules(JSON.parse(rules));

if (typeof generate_token_with_uid !== 'undefined' && generate_token_with_uid.length > 1) {
  var FirebaseTokenGenerator = require("firebase-token-generator");
  var tokenGenerator = new FirebaseTokenGenerator(SECRET);
  var token = tokenGenerator.createToken({ uid: generate_token_with_uid});
  console.log('new custom token for '+generate_token_with_uid, token);
}

server.setAuthSecret(SECRET);

console.info('FirebaseServer started at ' + hostname + ':' + port);

function exitHandler(options, err) {
    if (options.cleanup) {
      console.log('cleanup...', options);
      server.exportData().then(function (data) {
        console.log('exported data\n', data);
        server.close();
        process.exit();
      });
    }
    else {
      if (options.error) {
        console.log(err.stack);
      }
      // if (options.ext)
      console.log('exiting...', options);
      process.exit();
    }
}

//do something when app is closing
//process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true, cleanup: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {error:true}));
