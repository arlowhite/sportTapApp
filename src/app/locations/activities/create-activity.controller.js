define(["require", "exports"], function (require, exports) {
    var visibilityOptions = {
        'public': {
            label: 'Public',
            icon: 'public'
        },
        'friends': {
            label: 'Friends',
            icon: 'people'
        },
        'invite': {
            label: 'Invite-only',
            icon: 'lock'
        }
    };
    var CreateActivityController = (function () {
        function CreateActivityController($scope, db, $q, $mdToast, $location, $timeout, $rootScope) {
            'ngInject';
            var _this = this;
            this.$scope = $scope;
            this.db = db;
            this.$mdToast = $mdToast;
            this.$location = $location;
            this.$timeout = $timeout;
            if ($rootScope.Keyboard) {
                this.Keyboard = $rootScope.Keyboard;
            }
            // for now just use scope for data
            $scope.act = { invited: [] };
            $scope.today = new Date();
            // Default activity visibility
            $scope.visibility = 'friends';
            $scope.visibilityButton = visibilityOptions[$scope.visibility];
            $scope.$on('$ionicView.enter', function () {
                if ($scope.hasKeyboardPlugin) {
                    console.log('showing keyboard accessory bar');
                    _this.Keyboard.hideKeyboardAccessoryBar(false);
                }
            });
            $scope.$on('$ionicView.leave', function () {
                if ($scope.hasKeyboardPlugin) {
                    console.log('hiding keyboard accessory bar');
                    _this.Keyboard.hideKeyboardAccessoryBar(true);
                }
            });
            $q.all([db.myFriends(), db.invitedMe()]).then(function (results) {
                // FIXME WTF was I doing?
                var searchablePeople = [];
                searchablePeople.push.apply(searchablePeople, results[0]);
                searchablePeople.push.apply(searchablePeople, results[1]);
                for (var i = 0; i < searchablePeople.length; i++) {
                    searchablePeople[i]._lowername = searchablePeople[i].name.toLowerCase();
                    searchablePeople[i].email = 'foo@foo.com';
                }
                console.log('peeps', searchablePeople);
                _this.searchablePeople = searchablePeople;
            });
        }
        CreateActivityController.prototype.getSportMatches = function (text) {
            return this.db.querySports(text);
        };
        CreateActivityController.prototype.createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(contact) {
                return (contact._lowername.indexOf(lowercaseQuery) != -1);
            };
        };
        CreateActivityController.prototype.excludeSelected = function (contact) {
            //return contact.id not in $scope.act.invited;
            var invited = this.$scope.act.invited;
            for (var i = 0; i < invited.length; i++) {
                if (contact.id === invited[i].id) {
                    return false;
                }
            }
            // Not already selected
            return true;
        };
        CreateActivityController.prototype.queryFriends = function (query) {
            // query is what user typed into auto-complete search
            var results = query ? this.searchablePeople.filter(this.createFilterFor(query), this) : [];
            //console.log('results', results);
            // filter-out selected
            results = results.filter(this.excludeSelected, this);
            return results;
        };
        CreateActivityController.prototype.createActivity = function () {
            var $mdToast = this.$mdToast;
            this.$location.path('/app/activities');
            $mdToast.show($mdToast.simple().content(this.$scope.act.title + ' activity created'));
        };
        CreateActivityController.prototype.browseSports = function () {
            var $mdToast = this.$mdToast;
            $mdToast.show($mdToast.simple().content('TODO Browse sports dialog.'));
        };
        CreateActivityController.prototype.changeVisibility = function (r) {
            var $scope = this.$scope;
            $scope.visibilityButton = visibilityOptions[r];
            $scope.visibility = r;
        };
        CreateActivityController.prototype.openVisibilityMenu = function ($mdOpenMenu, ev) {
            var $scope = this.$scope;
            // Update menu entries before opening
            $scope.omitMenuVisibility = $scope.visibility;
            // Need to delay so menu updates before show
            this.$timeout(function () {
                $mdOpenMenu(ev);
            });
        };
        return CreateActivityController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CreateActivityController;
});
//# sourceMappingURL=create-activity.controller.js.map