
import angular = require('angular');
// Doesn't work even though agrees with TSD and documentation get context error
//import ngMock = require('angular-mocks/ngMock');

/*
 Hacked angular-mocks.d.ts to make this work with:
declare module "angularMocks" {
  export = inject;
}
  */
import inject = require('angularMocks');
if (inject !== angular.mock.inject) {
  throw new Error('Imported inject is not angular.mock.inject');
}
var module = angular.mock.module;

import SportTapFirebaseDb from './firebase-db.service';
import {SportTapPerson, SportTapActivity, SportTapDb} from './SportTapDb';

angular.module('app', [])
  .service('db', function ($q) {
    var db = new SportTapFirebaseDb('localhost.firebaseio.com', 5000, $q);
    // FIXME No difference if firebase-server is actually running, is it connecting?
    console.debug('Created SportTapFirebaseDb');
    return db;
  });


describe('creating Activity', () => {

  beforeEach(module('app'));

  var db: SportTapDb;
  var $timeout;
  beforeEach(inject(function (_$timeout_, _db_) {
    db = _db_;
    $timeout = _$timeout_;
  }));

  //it("should be listed under user's activities", done => {
  //  db.person(3).then(function(person) {
  //    console.log('got person in test', person);
  //    expect(person.name).toBe('Arlo');
  //  })
  //  .finally(done);
  //  $timeout.flush();
  //});

  it('lots of users', done => {
    db.myFriends().then(friends => {
      console.log('friends', friends);
      done();
    });
    //$timeout.verifyNoPendingTasks();
    //.finally(done);
    //$timeout(function () {
    //  $timeout.flush();
    //}, 1000);
    $timeout.flush();
  });
});
