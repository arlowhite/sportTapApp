/**
 * Detailed information about a single Activity.
 * TODO Load people list after main information
 */
define(["require", "exports"], function (require, exports) {
    var ActivityDetailController = (function () {
        function ActivityDetailController($scope, activity, db) {
            'ngInject';
            $scope.activity = activity;
            db.person(activity.creatorId).then(function (p) {
                $scope.creator = p;
            });
            $scope.sportIcon = db.sportIcon(activity.sport);
            $scope.$on('$ionicView.afterEnter', function () {
                // People take a long time to load
                $scope.viewEntered = true;
            });
            var myId = db.myId();
            if (activity.myRsvp) {
                $scope.$watch('activity.myRsvp', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        db.updateRsvp(activity.id, newVal);
                    }
                });
            }
        }
        return ActivityDetailController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ActivityDetailController;
});
//# sourceMappingURL=activity-detail.controller.js.map