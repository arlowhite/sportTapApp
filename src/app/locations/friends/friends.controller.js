define(["require", "exports"], function (require, exports) {
    var FriendsController = (function () {
        function FriendsController($scope, $timeout, friends) {
            'ngInject';
            $scope.friends = friends;
            var delayedShowTooltips = function () {
                if ($scope.isFabOpen) {
                    $scope.showActionTooltips = $scope.isFabOpen;
                }
            };
            $scope.$watch('isFabOpen', function (open) {
                if (open) {
                    $timeout(delayedShowTooltips, 1000);
                }
                else {
                    $scope.showActionTooltips = false;
                }
            });
        }
        return FriendsController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FriendsController;
});
//# sourceMappingURL=friends.controller.js.map