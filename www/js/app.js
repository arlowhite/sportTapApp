// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var momentDateParseFormats = ['MMM-DD-YYYY', 'dddd, MMMM Do'];
angular.module('material.components.datepicker')
/**
 * Override mdDatepicker to use moment's isValid so that
 * bad dates such as "Oct 44" are marked invalid.
 *
 */
  .run(function(mdDatepickerDirective) {
    var ctrlProto = mdDatepickerDirective[0].controller.prototype;
    var INVALID_CLASS = 'md-datepicker-invalid';
    ctrlProto.handleInputEvent = function() {
      var inputString = this.inputElement.value;
      var momentDate = moment(inputString, momentDateParseFormats);
      var parsedDate = momentDate.toDate();
      this.dateUtil.setDateTimeToMidnight(parsedDate);

      if (inputString === '') {
        this.ngModelCtrl.$setViewValue(null);
        this.date = null;
        this.inputContainer.classList.remove(INVALID_CLASS);
      } else if (momentDate.isValid() &&
        this.dateUtil.isDateWithinRange(parsedDate, this.minDate, this.maxDate)) {
        this.ngModelCtrl.$setViewValue(parsedDate);
        this.date = parsedDate;
        this.inputContainer.classList.remove(INVALID_CLASS);

        this._needsRenderOnBlur = this.isFocused;
        if(!this.isFocused){
          // Debounced after blur, Render now
          this.inputElement.value = this.dateLocale.formatDate(this.date);
          this.resizeInputElement();
        }
      } else {
        // If there's an input string, it's an invalid date.
        this.inputContainer.classList.toggle(INVALID_CLASS, inputString);
        this._needsRenderOnBlur = false;
      }
    };
    ctrlProto.setFocused = function(isFocused) {
      this.isFocused = isFocused;
      if(!isFocused && this._needsRenderOnBlur){
        // Blur
        this.inputElement.value = this.dateLocale.formatDate(this.date);
        this.resizeInputElement();
        this._needsRenderOnBlur = false;
      }
    };
  });


angular.module('sportSocial', ['ionic', 'ngMaterial',
  'sportSocial.controllers', 'sportSocial.services'])

  .run(function($ionicPlatform, $rootScope, $window, $localStorage, $ionicConfig, db) {
    $ionicPlatform.ready(function() {
      console.info('ionic ready');

      var jsScrolling = $ionicConfig.scrolling.jsScrolling();
      console.log('jsScrolling', jsScrolling);

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      $rootScope.hasKeyboardPlugin = window.cordova && window.cordova.plugins.Keyboard;
      if ($rootScope.hasKeyboardPlugin) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // Disable native scrolling if jsScrolling
        cordova.plugins.Keyboard.disableScroll(jsScrolling);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.error('stateChangeError', arguments);
        });

      // Note: iOS cloud backup can backup localStorage, (config.xml preference disables)
      // http://learn.ionicframework.com/formulas/localstorage/
      // Don't use device UUID
      // https://www.nowsecure.com/resources/secure-mobile-development/handling-sensitive-data/limit-use-of-uuid/

    });
  })

  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $mdGestureProvider,
                   $mdDateLocaleProvider, $mdThemingProvider) {

    // Disable caching, RSVP changes were not updating between views
    $ionicConfigProvider.views.maxCache(0);

    // Native scrolling recommended by:
    // http://julienrenaux.fr/2015/08/24/ultimate-angularjs-and-ionic-performance-cheat-sheet/
    // http://blog.ionic.io/native-scrolling-in-ionic-a-tale-in-rhyme/
    // TODO iOS works or not? Fallsback?
    // Disables browser pull-refresh
    // Doesn't seem smoother in Android...
    if(ionic.Platform.isAndroid()) {
      $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    //$mdThemingProvider.theme('default');

    // FIXME need skipClickHijack?
    // http://forum.ionicframework.com/t/is-there-a-tutorial-for-using-ionic-and-angular-material/14662/23
    $mdGestureProvider.skipClickHijack();

    $mdDateLocaleProvider.parseDate = function(dateString) {
      return moment(dateString, momentDateParseFormats).toDate();
    };

    // May not be used at all since handleInputEvent overridden above.
    $mdDateLocaleProvider.isDateComplete = function () {
      // moment handles parsing and validity is checked anyway
      return true;
    };

    $mdDateLocaleProvider.formatDate = function(date) {
      if(!date){
        return '';
      }
      return moment(date).format('dddd, MMMM Do');
    };

    // Put Android tabs on bottom instead of top, no striped
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');

    $mdThemingProvider.theme('default')
      .accentPalette('blue');

    //.primaryPalette('cyan') ugly :(

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app-ion-tabs.html',
        controller: 'AppCtrl'
      })
// FIXME Login is getting put into state history
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent':{
            templateUrl: 'templates/login.html'}
        }
      })

      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'tab-home': {
            templateUrl: 'templates/dashboard.html',
            // Just reusing simple controller for now
            controller: 'DashboardCtrl'
          }
        },
        resolve: {
          inviters: function(db) {
            return db.invitedMe();
          },
          myActivities: function(db) {
            return db.myActivities();
          }
        }
      })

      .state('app.friends', {
        url: '/friends',
        views: {
          'tab-friends': {
            templateUrl: 'templates/friends.html',
            controller: 'FriendsCtrl'
          }
        },
        // TODO this gets inherited by child states?
        resolve: {
          friends: function(db){
            return db.myFriends();
          }
        }
      })

      .state('app.friend_detail', {
        url: '/friend/{friendId}',
        views: {
          'tab-friends': {
            templateUrl: 'templates/friend_detail.html',
            controller: 'FriendCtrl'
          }
        },
        resolve: {
          friend: function ($stateParams, db) {
            return db.person($stateParams.friendId);
          }
        }
      })

      .state('app.activity_detail', {
        url: '/activity/{activityId}',
        views: {
          'tab-activities': {
            templateUrl: 'templates/activity_detail.html',
            controller: 'ActivityCtrl'
          }
        },
        resolve: {
          activity: function ($stateParams, db) {
            return db.activity($stateParams.activityId);
          }
        }
      })

      .state('app.friend_invites', {
        url: '/friend_invites',
        views: {
          'tab-friends': {
            templateUrl: 'templates/friend_invites.html',
            controller: 'FriendsCtrl'
          }
        },
        resolve: {
          friends: function(db) {
            return db.invitedMe();
          }
        }
      })

      .state('app.activities', {
        url: '/activities',
        views: {
          'tab-activities': {
            templateUrl: 'templates/activities.html',
            controller: 'ActivitiesTabsCtrl'
          }
        }
      })

      .state('app.create_activity', {
        url: '/create_activity',
        views: {
          'tab-activities': {
            templateUrl: 'templates/create_activity.html',
            controller: 'CreateActivityCtrl'
          }
        }
      })

      .state('app.activities.mine', {
        url: '/mine',
        views: {
          'mine-tab': {
            templateUrl: 'templates/activities_list.html',
            controller: 'ActivitiesCtrl'
          }
        }
      })
      .state('app.activities.friends', {
        url: '/friends',
        views: {
          'friends-tab':{
            templateUrl: 'templates/activities_list.html',
            controller: 'ActivitiesCtrl'
          }
        }
      })

      .state('app.account', {
        url: '/account',
        views: {
          'tab-account':{
            templateUrl: 'templates/account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/dashboard');
  })

  // TODO reorganize code by features
  // TODO Production: template cache  https://thinkster.io/templatecache-tutorial/
  // gulp-angular-templatecache for use with Gulp
  .directive('ssPersonItem', function($state, $mdToast, db, $timeout){
    return {
      restrict: "E",
      scope: {
        person: "="
      },

      // Can be a function to return different templates based on attrs
      templateUrl:"templates/widgets/person-item.html",
      link: function(scope, element, attrs) {
        scope.goToPerson = function () {
          $state.go('app.friend_detail', {friendId: scope.person.id});
        };

        var acts = scope.person.nextActivities;
        if(acts && acts.length>0){
          db.activity(acts[0]).then(function (act) {
            scope.nextActivity = act;
          });
        }

        scope.goToActivity = function () {
          // timeout to see ripple, but just slows down load
          //$timeout(function () {
          $state.go('app.activity_detail', {activityId: scope.nextActivity.id});
          //}, 150);
        };

      }
    }

  })

  .directive('ssPersonRsvp', function (db, $state) {
    return {
      restrict: "E",
      scope: {
        rsvp: "="
      },
      templateUrl:"templates/widgets/person-rsvp.html",
      link: function(scope, element, attrs) {
        db.person(scope.rsvp.pId).then(function (p) {
          scope.person = p;
        });

        scope.goToPerson = function () {
          $state.go('app.friend_detail', {friendId: scope.person.id});
        }
      }
    }
  })

  .directive('ssActivityCard', function ($mdToast, $timeout, $state, db, $q) {
    var secondsInDay = 24 * 60 * 60;

    var myId = db.myId();

    // TODO maybe make RSVP button its own directive
    var rsvpDisplay = {
      'going': {
        label: 'Going',
        icon: 'done',
        buttonClass: 'md-primary'
      },
      'maybe': {
        label: 'Maybe',
        icon: 'help',
        buttonClass: ''
      },
      'no': {
        label: 'Not Going',
        icon: 'thumb_down',
        buttonClass: 'md-warn'
      }
    };
    return {
      restrict: "E",
      scope: {
        activity: "="
      },
      templateUrl:"templates/widgets/activity-card.html",

      link: function(scope, element, attrs) {
        var actReady;

        if(attrs.activityId){
          if(scope.activity){
            console.warn('activity and activityId both defined!');
          }
          actReady = db.activity(attrs.activityId);
        }
        else{
          actReady = $q.when(scope.activity);
        }

        actReady.then(function (act) {
          if(!scope.activity){
            scope.activity = act;
          }

          db.person(act.creatorId).then(function (p) {
            scope.creator = p;
          });

          scope.sportIcon = db.sportIcon(act.sport);

          // Determining this should be efficient and day property is brittle
          // Sep 8 to Oct 8
          // FIXME 10pm to 2am next day
          scope.multiday = act.endUnix - act.startUnix > secondsInDay;

          // activity.myRsvp set if user RSVP'd to this Activity
          // rsvpButton - Current button styling/label
          // omitMenuRsvp - hides entry from menu (avoid user seeing menu change)
          if(act.myRsvp) {
            scope.rsvpButton = rsvpDisplay[act.myRsvp];

            scope.changeRsvp = function (r) {
              scope.rsvpButton = rsvpDisplay[r];
              scope.activity.myRsvp = r;
              // Update within rsvps as well
              var rsvps = scope.activity.rsvps;

              var found = false;
              for(var i=0; i<rsvps.length;i++){
                if(rsvps[i].pId == myId){
                  rsvps[i].r = r;
                  found = true;
                  break;
                }
              }
              if(!found){
                console.error('Failed to find matching RSVP for person/activity', myId, scope.activity.id);
                console.log(rsvps);
              }
            };

            scope.openRsvpMenu = function ($mdOpenMenu, ev) {
              // Update menu entries before opening
              scope.omitMenuRsvp = scope.activity.myRsvp;
              // Need to delay so menu updates before show
              $timeout(function () {
                $mdOpenMenu(ev);
              });
            };
          }

          scope.openActivityDetail = function () {
            $state.go('app.activity_detail', {activityId: scope.activity.id});
          };
        });

      }
    }
  })

  .filter('momentDate', function () {
    return function (date, format) {
      if(!date){
        return '';
      }
      return moment(date).format(format);
    }
  });
