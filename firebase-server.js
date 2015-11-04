var FirebaseServer = require('firebase-server');

var port = 5000;
var hostname = 'test.firebase.localhost';
new FirebaseServer(port, hostname, {
  /* You can put your initial data model here, or just leave it empty */
});

console.info('FirebaseServer started at ' + hostname + ':' + port);
