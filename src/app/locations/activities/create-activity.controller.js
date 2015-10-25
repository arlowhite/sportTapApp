
var visibilityOptions = {
  'public': {
    label: 'Public',
    icon: 'public'
  },
  'friends': {
    label: 'Friends',
    icon: 'people'
  },
  'invite': {
    label: 'Invite-only',
    icon: 'lock'
  }
};

class CreateActivityController {
  constructor($scope, db, $q, $mdToast, $location, $timeout) {
    'ngInject';

    // for now just use scope for data
    this.$scope = $scope;
    this.$location = $location;
    this.$mdToast = $mdToast;
    this.$timeout = $timeout;

    $scope.act = {invited: []};

    $scope.today = new Date();
    // Default activity visibility
    $scope.visibility = 'friends';

    $scope.visibilityButton = visibilityOptions[$scope.visibility];

    $scope.$on('$ionicView.enter', function () {
      if ($scope.hasKeyboardPlugin) {
        console.log('showing keyboard accessory bar');
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      }
    });
    $scope.$on('$ionicView.leave', function () {
      if ($scope.hasKeyboardPlugin) {
        console.log('hiding keyboard accessory bar');
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
    });

    var searchablePeople = [];
    this.searchablePeople = searchablePeople;
    $q.all([db.myFriends(), db.invitedMe()]).then(function (results) {
      searchablePeople.push.apply(searchablePeople, results[0]);
      searchablePeople.push.apply(searchablePeople, results[1]);
      for (var i = 0; i < searchablePeople.length; i++) {
        searchablePeople[i]._lowername = searchablePeople[i].name.toLowerCase();
        searchablePeople[i].email = 'foo@foo.com';
      }
      console.log('peeps', searchablePeople);
    });

    this.getSportMatches = db.querySports;
  }

  createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(contact) {
      return (contact._lowername.indexOf(lowercaseQuery) != -1);
    };
  }


  excludeSelected(contact) {
    //return contact.id not in $scope.act.invited;
    var invited = this.$scope.act.invited;
    for (var i = 0; i < invited.length; i++) {
      if (contact.id === invited[i].id) {
        return false;
      }
    }
    // Not already selected
    return true;
  }

  queryFriends (query) {
    // query is what user typed into auto-complete search
    var results = query ? this.searchablePeople.filter(this.createFilterFor(query), this) : [];
    //console.log('results', results);

    // filter-out selected
    results = results.filter(this.excludeSelected, this);
    return results;
  }

  createActivity () {
    var $mdToast = this.$mdToast;
    this.$location.path('/app/activities');
    $mdToast.show($mdToast.simple().content($scope.act.title + ' activity created'));
  }


  browseSports () {
    var $mdToast = this.$mdToast;
    $mdToast.show($mdToast.simple().content('TODO Browse sports dialog.'));
  }

  changeVisibility (r) {
    var $scope = this.$scope;
    $scope.visibilityButton = visibilityOptions[r];
    $scope.visibility = r;
  }

  openVisibilityMenu ($mdOpenMenu, ev) {
    var $scope = this.$scope;
    // Update menu entries before opening
    $scope.omitMenuVisibility = $scope.visibility;
    // Need to delay so menu updates before show
    this.$timeout(function () {
      $mdOpenMenu(ev);
    });
  }

}

export default CreateActivityController;
