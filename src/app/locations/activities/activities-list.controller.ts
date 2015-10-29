// Displays a list of activities

class ActivitiesListController {
  constructor(private $scope, $state, private $timeout) {
    'ngInject';

    console.info($state.current);
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
