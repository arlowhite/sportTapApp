define(["require", "exports"], function (require, exports) {
    var FriendInvitesController = (function () {
        function FriendInvitesController($scope, friends) {
            'ngInject';
            $scope.friends = friends;
        }
        return FriendInvitesController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FriendInvitesController;
});
//# sourceMappingURL=friend-invites.controller.js.map