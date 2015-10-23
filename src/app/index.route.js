function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'app/locations/main/app-ion-tabs.html',
      controller: 'MainController as mainCtrl'
    })
// FIXME Login is getting put into state history
//    .state('app.login', {
//      url: '/login',
//      views: {
//        'menuContent':{
//          templateUrl: 'templates/login.html'}
//      }
//    })
//
//    .state('app.dashboard', {
//      url: '/dashboard',
//      views: {
//        'tab-home': {
//          templateUrl: 'templates/dashboard.html',
//          // Just reusing simple controller for now
//          controller: 'DashboardCtrl as ctrl'
//        }
//      },
//      resolve: {
//        inviters: function(db) {
//          return db.invitedMe();
//        },
//        myActivities: function(db) {
//          // TODO separate not going?
//          return db.myActivities('>=', 1);
//        }
//      }
//    })
//
//    .state('app.friends', {
//      url: '/friends',
//      views: {
//        'tab-friends': {
//          templateUrl: 'templates/friends.html',
//          controller: 'FriendsCtrl'
//        }
//      },
//      // TODO this gets inherited by child states?
//      resolve: {
//        friends: function(db){
//          return db.myFriends();
//        }
//      }
//    })
//
//    .state('app.friend_detail', {
//      url: '/friend/{friendId}',
//      views: {
//        'tab-friends': {
//          templateUrl: 'templates/friend_detail.html',
//          controller: 'FriendCtrl'
//        }
//      },
//      resolve: {
//        friend: function ($stateParams, db) {
//          return db.person($stateParams.friendId);
//        }
//      }
//    })
//
//    .state('app.activity_detail', {
//      url: '/activity/{activityId}',
//      views: {
//        'tab-activities': {
//          templateUrl: 'templates/activity_detail.html',
//          controller: 'ActivityCtrl'
//        }
//      },
//      resolve: {
//        activity: function ($stateParams, db) {
//          return db.activity($stateParams.activityId);
//        }
//      }
//    })
//
//    .state('app.friend_invites', {
//      url: '/friend_invites',
//      views: {
//        'tab-friends': {
//          templateUrl: 'templates/friend_invites.html',
//          controller: 'FriendsCtrl'
//        }
//      },
//      resolve: {
//        friends: function(db) {
//          return db.invitedMe();
//        }
//      }
//    })
//
//    .state('app.activities', {
//      url: '/activities',
//      views: {
//        'tab-activities': {
//          templateUrl: 'templates/activities.html',
//          controller: 'ActivitiesTabsCtrl'
//        }
//      }
//    })
//
//    .state('app.create_activity', {
//      url: '/create_activity',
//      views: {
//        'tab-activities': {
//          templateUrl: 'templates/create_activity.html',
//          controller: 'CreateActivityCtrl'
//        }
//      }
//    })
//
//    .state('app.activities.mine', {
//      url: '/mine',
//      views: {
//        'mine-tab': {
//          templateUrl: 'templates/activities_list.html',
//          controller: 'ActivitiesCtrl'
//        }
//      }
//    })
//    .state('app.activities.friends', {
//      url: '/friends',
//      views: {
//        'friends-tab':{
//          templateUrl: 'templates/activities_list.html',
//          controller: 'ActivitiesCtrl'
//        }
//      }
//    })
//
    .state('app.account', {
      url: '/account',
      views: {
        'tab-account':{
          templateUrl: 'app/locations/account/account.html',
          controller: 'AccountController as accountCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/account');
}

export default routerConfig;
