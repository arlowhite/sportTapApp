define(["require", "exports"], function (require, exports) {
    function ssPersonItem($state, $mdToast, db, $timeout) {
        'ngInject';
        return {
            restrict: "E",
            scope: {
                person: "="
            },
            // Can be a function to return different templates based on attrs
            templateUrl: "app/components/person/person-item.html",
            link: function (scope, element, attrs) {
                scope.goToPerson = function () {
                    $state.go('app.friend_detail', { friendId: scope.person.id });
                };
                var acts = scope.person.nextActivities;
                if (acts && acts.length > 0) {
                    db.activity(acts[0]).then(function (act) {
                        scope.nextActivity = act;
                    });
                }
                scope.goToActivity = function () {
                    // timeout to see ripple, but just slows down load
                    //$timeout(function () {
                    $state.go('app.activity_detail', { activityId: scope.nextActivity.id });
                    //}, 150);
                };
            }
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ssPersonItem;
});
//# sourceMappingURL=person-item.directive.js.map