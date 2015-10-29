define(["require", "exports"], function (require, exports) {
    var FriendDetailController = (function () {
        function FriendDetailController($scope, friend) {
            'ngInject';
            $scope.friend = friend;
            //$ionicNavBarDelegate.title('Some Friend');
            /**
             * View all of this user's activity tags
             */
            // FIXME Friend sport tags view
            // (Removed popover CSS)
            //$scope.viewActivityTags = function ($event) {
            //  $ionicPopover.fromTemplateUrl('my-popover.html', {
            //    scope: $scope
            //  }).then(function (popover) {
            //    $scope.popover = popover;
            //    $scope.popover.show($event);
            //  });
        }
        return FriendDetailController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FriendDetailController;
});
//# sourceMappingURL=friend-detail.controller.js.map