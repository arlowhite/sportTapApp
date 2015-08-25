// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('sportSocial', ['ionic', 'sportSocial.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // Native scrolling recommended by:
    // http://julienrenaux.fr/2015/08/24/ultimate-angularjs-and-ionic-performance-cheat-sheet/
    // http://blog.ionic.io/native-scrolling-in-ionic-a-tale-in-rhyme/
    // TODO iOS works or not? Fallsback?
    // Disables browser pull-refresh
    // Doesn't seem smoother in Android...
    //$ionicConfigProvider.scrolling.jsScrolling(false);

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
            templateUrl: 'templates/dashboard.html'
          }
        }
      })

      .state('app.friends', {
        url: '/friends',
        views: {
          'menuContent': {
            templateUrl: 'templates/friends.html'
          }
        }
      })
      .state('app.activities', {
      url: '/activities',
      views: {
        'menuContent': {
          templateUrl: 'templates/activities.html'
          //controller: 'ActivitiesCtrl'
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
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/dashboard');
});
