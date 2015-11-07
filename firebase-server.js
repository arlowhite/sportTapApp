var FirebaseServer = require('firebase-server');

var port = 5000;
var hostname = 'localhost.firebaseio.com';

new FirebaseServer(port, hostname + ':' + port, {
  /* You can put your initial data model here, or just leave it empty */
});

console.info('FirebaseServer started at ' + hostname + ':' + port);
