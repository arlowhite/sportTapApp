
import {SportTapDb} from "../../services/SportTapDb";

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

  // HACK: Keyboard
  private Keyboard: any;

  private searchablePeople: any[];

  constructor(private $scope, private db: SportTapDb, $q, private $mdToast, private $location, private $timeout,
              $rootScope) {
    'ngInject';

    if ($rootScope.Keyboard) {
      this.Keyboard = $rootScope.Keyboard;
    }

    // for now just use scope for data
    $scope.act = {invited: []};

    $scope.today = new Date();
    // Default activity visibility
    $scope.visibility = 'friends';

    $scope.visibilityButton = visibilityOptions[$scope.visibility];

    $scope.$on('$ionicView.enter', () => {
      if ($scope.hasKeyboardPlugin) {
        console.log('showing keyboard accessory bar');
        this.Keyboard.hideKeyboardAccessoryBar(false);
      }
    });
    $scope.$on('$ionicView.leave', () => {
      if ($scope.hasKeyboardPlugin) {
        console.log('hiding keyboard accessory bar');
        this.Keyboard.hideKeyboardAccessoryBar(true);
      }
    });

    $q.all([db.myFriends(), db.invitedMe()]).then((results) => {
      let searchablePeople = [];
      // append the two arrays in results together into searchablePeople
      searchablePeople.push.apply(searchablePeople, results[0]);
      searchablePeople.push.apply(searchablePeople, results[1]);
      // Lowercase the name for comparison later
      for (let person of searchablePeople) {
        person._lowername = person.name.toLowerCase();
        person.email = 'foo@foo.com';
      }
      console.log('peeps', searchablePeople);
      this.searchablePeople = searchablePeople;
    });
  }

  getSportMatches(text: string) {
    return this.db.querySports(text);
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
    for (let invitee of invited) {
      if (contact.id === invitee.id) {
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
    $mdToast.show($mdToast.simple().content(this.$scope.act.title + ' activity created'));
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
