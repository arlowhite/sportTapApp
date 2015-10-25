// Displays a list of activities

class ActivitiesListController {
  constructor($scope, $state, $timeout) {
    'ngInject';

    console.info($state.current);
    this.$timeout = $timeout;
    this.$scope = $scope;
  }

  refresh () {
    //$http.get('/new-items')
    // .success(function(newItems) {
    //   $scope.items = newItems;
    // })
    // .finally(function() {
    // Stop the ion-refresher from spinning

    // FIXME example refresh
    var $scope = this.$scope;
    this.$timeout(function () {
      $scope.$broadcast('scroll.refreshComplete');
    }, 2000);
    //});
  };
}

export default ActivitiesListController;
