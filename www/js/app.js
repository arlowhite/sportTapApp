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


angular.module('sportSocial', ['ionic','ionic.service.core','ionic.service.deploy', 'ngCordova', 'ngMaterial',
  'ngProgress',
  'sportSocial.controllers', 'sportSocial.services'])

  .run(function($ionicPlatform, $rootScope, $ionicUser, $window, $localStorage) {
    $ionicPlatform.ready(function() {
      console.info('ionic ready');
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.error('stateChangeError', arguments);
        });

      // TODO iOS cloud backup can backup localStorage, (config.xml preference disables)
      // http://learn.ionicframework.com/formulas/localstorage/
      // Don't use device UUID
      // https://www.nowsecure.com/resources/secure-mobile-development/handling-sensitive-data/limit-use-of-uuid/
      var user_id = $localStorage.get('user_id');
      if (user_id===undefined){
        user_id = $ionicUser.generateGUID();
        console.info('Generated user_id='+user_id);
        $localStorage.set('user_id', user_id);
      }
      else {
        console.log('user_id', user_id);
      }
      $ionicUser.identify({
        user_id: user_id
      });
    });
  })

  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $mdGestureProvider,
                   $mdDateLocaleProvider) {
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

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
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
          'menuContent': {
            templateUrl: 'templates/dashboard.html',
            // Just reusing simple controller for now
            controller: 'DashboardCtrl'
          }
        },
        resolve: {
          inviters: function(db) {
            return db.invitedMe();
          }
        }
      })

      .state('app.friends', {
        url: '/friends',
        views: {
          'menuContent': {
            templateUrl: 'templates/friends.html',
            controller: 'FriendsCtrl'
          }
        },
        resolve: {
          friends: function(db){
            return db.myFriends();
          }
        }
      })

      .state('app.friend_detail', {
        url: '/friend/{friendId}',
        views: {
          'menuContent': {
            templateUrl: 'templates/friend_detail.html',
            controller: 'FriendCtrl'
          }
        },
        resolve: {
          friend: function ($stateParams, db) {
            return db.user($stateParams.friendId);
          }
        }
      })

      .state('app.friend_invites', {
        url: '/friend_invites',
        views: {
          'menuContent': {
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
          'menuContent': {
            templateUrl: 'templates/activities.html',
            controller: 'ActivitiesTabsCtrl'
          }
        }
      })

      .state('app.create_activity', {
        url: '/create_activity',
        views: {
          'menuContent': {
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
          'menuContent':{
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
  .directive('ssPersonItem', function($state){
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
      }
    }

  })

  .directive('ssActivityCard', function ($mdToast) {
    return {
      restrict: "E",
      scope: {
        activity: "="
      },
      templateUrl:"templates/widgets/activity-card.html",

      link: function(scope, element, attrs) {

        scope.activity = {rsvp: {
          label: 'Going',
          icon: 'done',
          buttonClass: 'md-primary'
        }};

        scope.rsvp = function(label, icon, buttonClass) {
          console.log('rsvp', arguments);
          scope.activity.rsvp.label = label;
          scope.activity.rsvp.icon = icon;
          scope.activity.rsvp.buttonClass = buttonClass;
        };

        var originatorEv; // Example uses to pop dialog from menu button
        // https://material.angularjs.org/latest/#/demo/material.components.menu
        scope.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };

        scope.openActivityDetail = function () {
          $mdToast.show($mdToast.simple().content('TODO: Activity detail view.'));
        };

      }
    }
  });

//
//.directive('nativeDatePicker', function ($cordovaDatePicker) {
//  return {
//    restrict: "AE",
//    replace: false,
//    link: function (scope, elem, attrs) {
//
//      //cache current index
//      var c_index = scope.inputNavParams.current_position - 1;
//
//      //update label
//      scope.label = scope.inputs.list[c_index].label;
//
//      //show date format (set via form builder)
//      scope.format = scope.inputs.list[c_index].datetime_format;
//
//      //display cached/default/empty value on view
//      scope.setCachedValue(c_index);
//
//      scope.datePicker = function () {
//
//        // $cordovaDatePicker.show({
//        // date : new Date(),
//        // mode : "date"
//        // }, function(date) {
//        // console.log(date);
//        // });
//
//        var options = {
//          date: new Date(),
//          mode: 'date'
//        };
//        $cordovaDatePicker.show(options, function (date) {
//          //console.log("date result " + date);
//          alert(date);
//        });
//        // TODO date picker error with ANdroid
//
//      };
//
//    }
//  }
//});
