import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';
import monkeyPatch from './monkeypatch'

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

import FakeDbService from './services/fake-db.service.js'
import LocalStorage from './services/localStorage.service';

import activityCardDirective from './components/activity/activity-card.directive';
import rsvpMenu from './components/activity/rsvp-menu.directive';
import momentDate from './components/filters';
import personItem from './components/person/person-item.directive';
import personRsvp from './components/person/person-rsvp.directive';

monkeyPatch();

// TODO Verify performance release features
// template cache  https://thinkster.io/templatecache-tutorial/ (obsolete due to new build system?)
// gulp-angular-templatecache for use with Gulp

//angular.module('angularGulpIonicBoilerplate', ['ionic', 'ui.router'])
angular.module('sportSocial', ['ionic', 'ngMaterial', 'ngMessages'])
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
