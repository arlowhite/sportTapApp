/// <reference path="typings/tsd.d.ts" />

// Adjust compilation in tsconfig.json
// https://github.com/Microsoft/TypeScript/wiki/Compiler-Options
// Specify module code generation: 'commonjs', 'amd', 'system', or 'umd'.

import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';
import monkeyPatch from './monkeypatch';

import MainController from './locations/main/main.controller';
import HomeController from './locations/home/home.controller';
import FriendsController from './locations/friends/friends.controller';
import FriendDetailController from './locations/friends/friend-detail.controller';
import FriendInvitesController from './locations/friends/friend-invites.controller';
import AccountController from './locations/account/account.controller';
import ActivitiesTabsController from './locations/activities/activities-tabs.controller';
import ActivitiesListController from './locations/activities/activities-list.controller';
import ActivityDetailController from './locations/activities/activity-detail.controller';
import CreateActivityController from './locations/activities/create-activity.controller';

import FakeDbService from './services/fake-db.service';
import LocalStorage from './services/localStorage.service';

import activityCardDirective from './components/activity/activity-card.directive';
import rsvpMenu from './components/activity/rsvp-menu.directive';
import momentDate from './components/filters';
import personItem from './components/person/person-item.directive';
import personRsvp from './components/person/person-rsvp.directive';

// Giveup on ES6 SystemJS modules and just load the old fashioned way.
// http://stackoverflow.com/questions/32987273/typescript-module-systems-on-momentjs-behaving-strangely
// import momentModule = require('moment');
// var moment = (momentModule as any).default;
// Compiler no default export error, but fixed by changing .d.ts "export =" to "export default"
// import moment from 'moment';
// import angular = require('angular');
// Suggestions from http://www.jbrantly.com/es6-modules-with-typescript-and-webpack/
//import * as someLib from 'someLib'; // this will work
//import { someProp } from 'someLib'; // this will also work

monkeyPatch();

// TODO Verify performance release features
// template cache  https://thinkster.io/templatecache-tutorial/ (obsolete due to new build system?)
// gulp-angular-templatecache for use with Gulp
angular.module('sportTap', ['ionic', 'ngMaterial', 'ngMessages', 'ngAnimate'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)

  .controller('MainController', MainController)
  .controller('HomeController', HomeController)
  .controller('FriendsController', FriendsController)
  .controller('FriendDetailController', FriendDetailController)
  .controller('FriendInvitesController', FriendInvitesController)
  .controller('AccountController', AccountController)
  .controller('ActivitiesTabsController', ActivitiesTabsController)
  .controller('ActivitiesListController', ActivitiesListController)
  .controller('ActivityDetailController', ActivityDetailController)
  .controller('CreateActivityController', CreateActivityController)

  .service('$localStorage', LocalStorage)
  .service('db', FakeDbService)

  .directive('ssActivityCard', activityCardDirective)
  .directive('ssRsvpMenu', rsvpMenu)
  .directive('ssPersonItem', personItem)
  .directive('ssPersonRsvp', personRsvp)

  .filter('momentDate', momentDate);

ionic.Platform.ready(function () {
// Need to manually bootstrap for SystemJS to work
  console.log('document/ionic ready, bootstraping angular');
  angular.bootstrap(document, ['sportTap'], {
    strictDi: false
  });
});


// TODO enable strictDi for builds where ngAnnotate was run
//angular.element(document).ready(function() {
//  console.log('document ready, bootstraping angular');
//  angular.bootstrap(document, ['sportTap'], {
//    strictDi: false
//  });
//});
