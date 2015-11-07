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

var PORT = 5000;

var Firebase = proxyquire('firebase', {
	'faye-websocket': {
		Client: function (url) {
			//url = url.replace(/dummy\d+\.firebaseio\.test/i, 'localhost').replace('wss://', 'ws://');
      console.log('GOT url', url);
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

var db = new SportTapFirebaseDb('localhost.firebaseio.com', 5000, Promise.defer, Firebase);
//    // FIXME No difference if firebase-server is actually running, is it connecting?
console.log('Created SportTapFirebaseDb');


describe('creating users', () => {

  after(() => {
    // Go offline?
  });

  // TODO try just returning promise

  it("should be listed under user's activities", () => {

    return expect(db.person(3)).to.eventually.deep.equal({
      name: 'Arlo',
      age: 29
    });

    // Alternatives
    //return db.person(3).then(function(person) {
    //  console.log('got person in test', person);
    //  expect(person.name).to.equal('Arlo');
    //});
    //return expect(db.person(3)).to.eventually.have.property('name');
  });

  //eventually.be.rejectedWith

  it('lots of users', () => {
    var p = db.myFriends().then(friends => {
      for (let key in friends) {
        let friend = friends[key];
        expect(friend).to.have.property('name', 'Arlo');
      }
    });
    //expect(p).to.eventually.have.property('name');
//to.eventually.equal(2)
    //p.should.eventually
    //expect(p).to.be.fulfilled.then(() => {
    //});

    return p;
  });
});
