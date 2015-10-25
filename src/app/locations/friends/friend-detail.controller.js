
class FriendDetailController {
  constructor($scope, friend) {
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
}

export default FriendDetailController;
