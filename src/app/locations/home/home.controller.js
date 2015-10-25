
class HomeController {
  constructor($scope, $timeout, $mdToast, inviters, myActivities, db) {
    'ngInject';

    // TODO which way to load data? resolve or db calls here?
    this.inviters = inviters;
    this.myActivities = myActivities;
    db.myActivities('==', 0).then(acts => {
        this.activityInvites = acts;
      }
    );

    //$scope.$on('$ionicView.enter', function () {
      //$mdToast.show($mdToast.simple().content('Demonstrating material headers, possible performance issues.'));
    //});
  }
}

export default HomeController;
