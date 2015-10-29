define(["require", "exports"], function (require, exports) {
    function routerConfig($stateProvider, $urlRouterProvider) {
        'ngInject';
        $stateProvider
            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/locations/main/app-ion-tabs.html',
            controller: 'MainController as mainCtrl'
        })
            .state('app.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'app/locations/home/home.html',
                    controller: 'HomeController as homeCtrl'
                }
            },
            resolve: {
                inviters: function (db) {
                    return db.invitedMe();
                },
                myActivities: function (db) {
                    // TODO separate not going?
                    return db.myActivities('>=', 1);
                }
            }
        })
            .state('app.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'app/locations/friends/friends.html',
                    controller: 'FriendsController'
                }
            },
            // TODO this gets inherited by child states?
            resolve: {
                friends: function (db) {
                    return db.myFriends();
                }
            }
        })
            .state('app.friend_detail', {
            url: '/friend/{friendId}',
            views: {
                'tab-friends': {
                    templateUrl: 'app/locations/friends/friend_detail.html',
                    controller: 'FriendDetailController'
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
                    templateUrl: 'app/locations/activities/activity_detail.html',
                    controller: 'ActivityDetailController as actCtrl'
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
                    templateUrl: 'app/locations/friends/friend_invites.html',
                    controller: 'FriendInvitesController'
                }
            },
            resolve: {
                friends: function (db) {
                    return db.invitedMe();
                }
            }
        })
            .state('app.activities', {
            url: '/activities',
            views: {
                'tab-activities': {
                    templateUrl: 'app/locations/activities/activities.html',
                    controller: 'ActivitiesTabsController as actTabsCtrl'
                }
            }
        })
            .state('app.create_activity', {
            url: '/create_activity',
            views: {
                'tab-activities': {
                    templateUrl: 'app/locations/activities/create_activity.html',
                    controller: 'CreateActivityController as createActCtrl'
                }
            }
        })
            .state('app.activities.mine', {
            url: '/mine',
            views: {
                'mine-tab': {
                    templateUrl: 'app/locations/activities/activities_list.html',
                    controller: 'ActivitiesListController as actListCtrl'
                }
            }
        })
            .state('app.activities.friends', {
            url: '/friends',
            views: {
                'friends-tab': {
                    templateUrl: 'app/locations/activities/activities_list.html',
                    controller: 'ActivitiesListController as actListCtrl'
                }
            }
        })
            .state('app.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'app/locations/account/account.html',
                    controller: 'AccountController as accountCtrl'
                }
            }
        });
        $urlRouterProvider.otherwise('/app/home');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = routerConfig;
});
//# sourceMappingURL=index.route.js.map