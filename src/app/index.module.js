/// <reference path="typings/tsd.d.ts" />
define(["require", "exports", './index.config', './index.route', './index.run', './monkeypatch', './locations/main/main.controller', './locations/home/home.controller', './locations/friends/friends.controller', './locations/friends/friend-detail.controller', './locations/friends/friend-invites.controller', './locations/account/account.controller', './locations/activities/activities-tabs.controller', './locations/activities/activities-list.controller', './locations/activities/activity-detail.controller', './locations/activities/create-activity.controller', './services/fake-db.service', './services/localStorage.service', './components/activity/activity-card.directive', './components/activity/rsvp-menu.directive', './components/filters', './components/person/person-item.directive', './components/person/person-rsvp.directive'], function (require, exports, index_config_1, index_route_1, index_run_1, monkeypatch_1, main_controller_1, home_controller_1, friends_controller_1, friend_detail_controller_1, friend_invites_controller_1, account_controller_1, activities_tabs_controller_1, activities_list_controller_1, activity_detail_controller_1, create_activity_controller_1, fake_db_service_1, localStorage_service_1, activity_card_directive_1, rsvp_menu_directive_1, filters_1, person_item_directive_1, person_rsvp_directive_1) {
    monkeypatch_1.default();
    // TODO Verify performance release features
    // template cache  https://thinkster.io/templatecache-tutorial/ (obsolete due to new build system?)
    // gulp-angular-templatecache for use with Gulp
    angular.module('sportSocial', ['ionic', 'ngMaterial', 'ngMessages'])
        .config(index_config_1.default)
        .config(index_route_1.default)
        .run(index_run_1.default)
        .controller('MainController', main_controller_1.default)
        .controller('HomeController', home_controller_1.default)
        .controller('FriendsController', friends_controller_1.default)
        .controller('FriendDetailController', friend_detail_controller_1.default)
        .controller('FriendInvitesController', friend_invites_controller_1.default)
        .controller('AccountController', account_controller_1.default)
        .controller('ActivitiesTabsController', activities_tabs_controller_1.default)
        .controller('ActivitiesListController', activities_list_controller_1.default)
        .controller('ActivityDetailController', activity_detail_controller_1.default)
        .controller('CreateActivityController', create_activity_controller_1.default)
        .service('$localStorage', localStorage_service_1.default)
        .service('db', fake_db_service_1.default)
        .directive('ssActivityCard', activity_card_directive_1.default)
        .directive('ssRsvpMenu', rsvp_menu_directive_1.default)
        .directive('ssPersonItem', person_item_directive_1.default)
        .directive('ssPersonRsvp', person_rsvp_directive_1.default)
        .filter('momentDate', filters_1.default);
});
//# sourceMappingURL=index.module.js.map