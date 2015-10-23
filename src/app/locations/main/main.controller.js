class MainController {
  constructor($scope, $ionicModal, $timeout, $ionicActionSheet, $state, $location) {
    'ngInject';

    // FIXME move to this
    // TODO old tabNav code
    $scope.tabNav = function (name) {
      console.log('TABVNAV');
      /*
       TODO if start at detail view and change state, this creates a back state to that view
       Not sure if want to just clearHistory at that point

       This clears out view state (resets from tab detail view)

        */

      // if current location under tab
      if($location.path().indexOf(name) != -1){
        $state.go('app.'+name);
      }
      else {
        $location.path('/app/' + name);
        // default tab click
      }
    };

    $scope.onTabSelected = function () {
      console.log('tabselect', this);
      //$ionicHistory
      var state = $location.state();
      console.log('state', state);
    };

  }
}

export default MainController;
