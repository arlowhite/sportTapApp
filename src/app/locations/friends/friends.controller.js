
class FriendsController {

  constructor($scope, $timeout, friends) {
    'ngInject';

    $scope.friends = friends;

    var delayedShowTooltips = function () {
      if ($scope.isFabOpen) {
        $scope.showActionTooltips = $scope.isFabOpen;
      }
    };

    $scope.$watch('isFabOpen', open => {
      if (open) {
        $timeout(delayedShowTooltips, 1000);
      }
      else {
        $scope.showActionTooltips = false;
      }
    });
  }
}

export default FriendsController;
