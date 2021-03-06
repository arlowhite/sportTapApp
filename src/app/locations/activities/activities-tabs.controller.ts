class ActivitiesTabsController {
  constructor($scope, $timeout, db) {
    'ngInject';

    //$scope.$watch('selectedIndex', function (current, old, childScope) {
    //  console.log('watch.selectedIndex', current, childScope);
    //  // FIXME use ion-nav-view or not?
    //  //http://ionicframework.com/docs/api/directive/ionNavView/
    //  //childScope.content = 'Foo';
    //  //$state.go('app.activities.friends');
    //});


    $scope.$on('$ionicView.afterEnter', function () {
      // Not sure why needed timeout, but never so indicator without it
      $timeout(function () {
        db.myActivities('>=', 1).then(function (acts) {
          // FIXME activities load slower here than the Dashboard!?
          console.log('set myActivities', acts);
          // TODO reference service object instead? think about when doing firebaseArray
          $scope.myActivities = acts;
        });
      }, 10);
    });
  }

  mineSelected () {
    console.log('mineSelected', arguments);
  }
}

export default ActivitiesTabsController;
