// Unit test typings
/// <reference path="../typings/bluebird/bluebird.d.ts" />
/// <reference path="../typings/proxyquire/proxyquire.d.ts" />
/// <reference path="../my-typings/faye-websocket.d.ts" />
/// <reference path="../my-typings/source-map-support.d.ts" />

/*
Need to run with Mocha for Node Modules to load dependencies.
Tried to use karma-commonjs and karma-systemjs with node_modules (such as proxyquire), but
hunting down the dependencies was a pain and not sure it was going to work anyway.
 */
import sourceMapSupport = require('source-map-support');
sourceMapSupport.install({handleUncaughtExceptions: false});

import chai = require("chai");
var expect = chai.expect;
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import Promise = require('bluebird');

/*
 Doesn't work even though agrees with TSD and documentation get context error
 import ngMock = require('angular-mocks/ngMock');

 So hacked angular-mocks.d.ts to make this work with:
declare module "angularMocks" {
  export = inject;
}
  */
//import inject = require('angularMocks');
//if (inject !== angular.mock.inject) {
//  throw new Error('Imported inject is not angular.mock.inject');
//}
//var module = angular.mock.module;

import SportTapFirebaseDb from './firebase-db.service';
import {SportTapPerson, SportTapActivity, SportTapDb} from './SportTapDb';

// From:  https://github.com/urish/firebase-server/blob/master/test/server.spec.js
// Not sure why /etc/hosts trick was not working. Though seems like it's working now?
import originalWebsocket = require('faye-websocket');
import proxyquire = require('proxyquire');

// Firebase error code checking
// Note: need to add code: TypeComparison; to Assertion interface in chai.d.ts
const PERMISSION_DENIED = 'PERMISSION_DENIED';
const Assertion = chai.Assertion;
Assertion.addMethod('code', function(error_code) {
  var obj = this._obj;

  new Assertion(obj).to.be.instanceof(Error);

  this.assert(
    obj.code === error_code
    , "expected #{this} to have code #{exp} but got #{act}"
    , "expected #{this} to not be code #{act}"
    , error_code        // expected
    , obj.code   // actual
  );

});

const HOSTNAME = 'localhost.firebaseio.com';
const PORT = 5000;

const Firebase = proxyquire('firebase', {
	'faye-websocket': {
		Client: function (url) {
      // Example iterrated URL subdomains, not really needed
			//url = url.replace(/dummy\d+\.firebaseio\.test/i, 'localhost').replace('wss://', 'ws://');
			return new originalWebsocket.Client('ws://localhost:'+PORT);
		}
	}
});

// Leave as reference for other tests
//angular.module('app', [])
//  .service('db', function ($q) {
//    // $q required $timeout.flush, which wasn't working in all tests for some reason.
//    var db = new SportTapFirebaseDb('localhost.firebaseio.com', 5000, Firebase, Promise.defer);
//    // FIXME No difference if firebase-server is actually running, is it connecting?
//    console.debug('Created SportTapFirebaseDb');
//    return db;
//  });
// within describe
//beforeEach(module('app'));
//var db: SportTapDb;
//var $timeout;
//beforeEach(inject(function (_$timeout_, _db_) {
//  db = _db_;
//  $timeout = _$timeout_;
//}));
// Note: with $q need to do $timeout.flush()

const ADMIN_CUSTOM_AUTH_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImFkbWluIn0sImlhd' +
  'CI6MTQ0NzA0NTYwN30.T97tcd-K7qQeHVb4DJlfqCKpehpq9RhEO-IftJ1tlrg';
const CUSTOM_AUTH_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6InVuaXQtdGVzdGluZyJ9LC' +
  'JpYXQiOjE0NDcwNDU2Nzd9.IVrLgZZxUmp8KQVfPHmCGIWQXRsZXHTg1aA_qXcAnUY';
const CUSTOM_AUTH_TOKEN_MALIGNANT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Im1hbGlnbmFud' +
  'C11bml0LXRlc3RpbmcifSwiaWF0IjoxNDQ3MDU1ODI1fQ.Ut7QHgqjw7xJHVrOmZRGBo0BRjSF0IaqCn-80MOWbvQ';

const MAIN_UID = 'unit-testing';
const MALIGNANT_UID = 'malignant-unit-testing';
// A value to set indicating maliginant user succeeded. TODO check for this in data dump
const MALICIOUS_VALUE = 'MALICIOUS VALUE!!!';

const db = new SportTapFirebaseDb(HOSTNAME, PORT, Promise.defer, Firebase);
// Not sure how to check if connected except for tests failing.
console.log('Created SportTapFirebaseDb');

// Mocha has a root suite
before(function(done){
  // Wipe Database before testing
  // Separate User does this https://www.firebase.com/docs/security/guide/securing-data.html
  // because "The child rules can only grant additional privileges to what parent nodes have already declared.
  // They cannot revoke a read or write privilege."
  console.log(', admin wiping database...');

  // Don't use db object to wipe database;
  let firebase = new Firebase(`ws://${HOSTNAME}:${PORT}`);

  // Need to authenticate first to have permission to set root
  firebase.authWithCustomToken(ADMIN_CUSTOM_AUTH_TOKEN, function(error, authData) {
    expect(error).to.be.null;
    expect(authData).to.have.property('uid', 'admin');

    firebase.set({}, (error) => {
      expect(error).to.be.null;
      firebase.unauth();
      done();
    });
  });
});

//after(function() {
//  // Go offline?
//});



describe('custom auth with unit-testing', function() {

  let client = db.client;
  //let email = 'bob@sporttap.com';
  //let password = 'aunth09aou23p23';
  //it("anonymous login", function (done) {
  //  client.authAnonymously(function (error, authData) {
  //    expect(error).to.be.undefined();
  //
  //    console.log('authData', authData);
  //  });
  //});

  it("custom auth", function (done) {
    client.authWithCustomToken(CUSTOM_AUTH_TOKEN, function (error, authData) {
      expect(error).to.be.null;
      expect(authData).to.have.property('uid', MAIN_UID);
      expect(authData).to.have.property('provider', 'custom');
      done();
    });

  });

  it('should not be able to wipe database', function (done) {
    client.set({}, (error) => {
      //expect(error).to.be.a('Error').and.to.have.property('code', 'PERMISSION_DENIED');
      expect(error).code(PERMISSION_DENIED);
      done();
    });
  });

  // ERROR: This custom Firebase server ('firebaseio.com:5000') does not support delegated login.
  //it('creates a user', function(done) {
  //  client.createUser({
  //    email: email,
  //    password: password
  //  }, function(error, userData) {
  //    //if(error) {
  //    expect(error).to.be.undefined();
  //
  //    console.log('userData', userData);
  //    done();
  //  });
  //});

  //it("should be listed under user's activities", function() {
  //
  //  return expect(db.person(3)).to.eventually.deep.equal({
  //    name: 'Arlo',
  //    age: 29
  //  });
  //
  //  // Alternatives
  //  //return db.person(3).then(function(person) {
  //  //  console.log('got person in test', person);
  //  //  expect(person.name).to.equal('Arlo');
  //  //});
  //  //return expect(db.person(3)).to.eventually.have.property('name');
  //});

  //eventually.be.rejectedWith

//  it('lots of users', function() {
//    var p = db.myFriends().then(friends => {
//      let count = 0;
//      for (let key in friends) {
//        let friend = friends[key];
//        expect(friend).to.have.property('name', 'Arlo');
//        count ++;
//      }
//      expect(count).to.equal(1);
//    });
//    //expect(p).to.eventually.have.property('name');
////to.eventually.equal(2)
//    //p.should.eventually
//    //expect(p).to.be.fulfilled.then(() => {
//    //});
//
//    return p;
//  });
});

var activityKey;
describe('activities', function() {
  it('create activity', function () {
    //let act: SportTapActivity = {
    //  id: 'foo'
    //};
    //act.
    let p = db.createActivity({
      title: "Scuba dive",
      sport: "scuba",
      locName: "Target rock",
      descr: "You must bring scuba gear. Make sure to rent gear from the shop before it closes at 6pm.",
      rsvps:[
        {pId:'3', r:'3'},
        {pId:'6', r:'3'},
        {pId:'7', r:'3'},
        {pId:'8', r:'3'},
        {pId:'4', r:'2'},
        {pId:'10', r:'1'}
      ]
    });
    expect(p).to.be.fulfilled;
    p.then(key => {
      activityKey = key;
    });
    return p;
  });

  it('update activity', function (done) {
    db.activitiesRef.child(activityKey).update({
      title: 'Changed title'
    }, (error) => {
      expect(error).to.be.null;
      done();
    });
  });

});

describe('malicous behavior', function() {
  let client = db.client;

  before(function (done) {
    client.unauth();

    client.authWithCustomToken(CUSTOM_AUTH_TOKEN_MALIGNANT, function (error, authData) {
      expect(error).to.be.null;
      expect(authData).to.have.property('uid', MALIGNANT_UID);
      expect(authData).to.have.property('provider', 'custom');
      done();
    });
  });

  it("cannot write to other user's activity", function (done) {
    db.activitiesRef.child(activityKey).update({
      creatorId: MAIN_UID,
      title: MALICIOUS_VALUE
    }, (error) => {
      expect(error).code(PERMISSION_DENIED);
      done();
    });
  });
});
