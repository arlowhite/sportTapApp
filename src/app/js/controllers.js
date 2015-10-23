angular.module('sportSocial.controllers', ['ngMessages'])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet, $state, $location) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    //console.log(window.device.uuid);

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

    // TODO lazy-load modals?
    $ionicModal.fromTemplateUrl('templates/invite_friends.html', {
      scope: $scope
      //animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.inviteFriendsModal = modal;
    });


    $scope.addThing = function(){
      $ionicActionSheet.show({
        buttons: [
          { text: 'Add activity' },
          { text: 'Invite friends' }
        ],
        //titleText: 'Modify your album',
        cancelText: 'Cancel',
        //cancel: function() {
        //  // add cancel code..
        //},
        buttonClicked: function(index) {
          if(index==0){
            $scope.addActivity();
          }
          else if(index==1){
            $scope.inviteFriends();
          }
          return true;
        }
      });
    };

    $scope.inviteFriends = function () {
      $scope.inviteFriendsModal.show();
    };

    $scope.hideInviteFriends = function () {
      $scope.inviteFriendsModal.hide();
      //console.warn('HERE2'); FIXME fires twice
    };

    $scope.$on('$destroy', function() {
      $scope.inviteFriendsModal.remove();
      $scope.modal.remove();
    });

  })


  .controller('ActivitiesTabsCtrl', function($scope, $state, $timeout, $ionicPlatform, db) {
    //$scope.$watch('selectedIndex', function (current, old, childScope) {
    //  console.log('watch.selectedIndex', current, childScope);
    //  // FIXME use ion-nav-view or not?
    //  //http://ionicframework.com/docs/api/directive/ionNavView/
    //  //childScope.content = 'Foo';
    //  //$state.go('app.activities.friends');
    //});

    $scope.mineSelected = function () {
      console.log('mineSelected', arguments);
    };

    $scope.$on('$ionicView.afterEnter', function() {
      // Not sure why needed timeout, but never so indicator without it
      $timeout(function () {
        db.myActivities('>=', 1).then(function (acts) {
          // FIXME activities load slower here than the Dashboard!?
          console.log('set myActivities');
          $scope.myActivities = acts;
        });
      }, 10);
    });
  })

  // Displays a list of activities
  .controller('ActivitiesCtrl', function($scope, $state, $timeout) {
    console.info($state.current);

    $scope.refresh = function() {
    //$http.get('/new-items')
    // .success(function(newItems) {
    //   $scope.items = newItems;
    // })
    // .finally(function() {
       // Stop the ion-refresher from spinning
      $timeout(function () {
        $scope.$broadcast('scroll.refreshComplete');
      }, 2000);
     //});
    };

  })

  .controller('ActivityCtrl', function ($scope, activity, $timeout, db) {
    $scope.activity = activity;

    db.person(activity.creatorId).then(function (p) {
      $scope.creator = p;
    });
    $scope.sportIcon = db.sportIcon(activity.sport);

    $scope.$on('$ionicView.afterEnter', function(){
      // People take a long time to load
      $scope.viewEntered = true;
    });

    var myId = db.myId();
    if(activity.myRsvp) {
      $scope.$watch('activity.myRsvp', function (newVal, oldVal) {
        if(newVal !== oldVal){
          db.updateRsvp(activity.id, newVal);
        }
      });
    }
  })

  .controller('CreateActivityCtrl', function ($scope, db, $q, $mdToast, $location, $timeout) {
    $scope.act = {invited: []};

    $scope.today = new Date();
    // Default activity visibility
    $scope.visibility = 'friends';

    $scope.$on('$ionicView.enter', function(){
      if($scope.hasKeyboardPlugin) {
        console.log('showing keyboard accessory bar');
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      }
    });
    $scope.$on('$ionicView.leave', function(){
      if($scope.hasKeyboardPlugin) {
        console.log('hiding keyboard accessory bar');
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
    });

    var searchablePeople = [];
    $q.all([db.myFriends(), db.invitedMe()]).then(function (results) {
      searchablePeople.push.apply(searchablePeople, results[0]);
      searchablePeople.push.apply(searchablePeople, results[1]);
      for(var i=0; i<searchablePeople.length; i++){
        searchablePeople[i]._lowername = searchablePeople[i].name.toLowerCase();
        searchablePeople[i].email = 'foo@foo.com';
      }
      console.log('peeps', searchablePeople);
    });

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);
      };
    }

    function excludeSelected(contact) {
      //return contact.id not in $scope.act.invited;
      var invited = $scope.act.invited;
      for(var i=0; i<invited.length; i++){
        if(contact.id==invited[i].id){
          return false;
        }
      }
      // Not already selected
      return true;
    }

    $scope.queryFriends = function (query) {
      // query is what user typed into auto-complete search
      var results = query ? searchablePeople.filter(createFilterFor(query)) : [];
      //console.log('results', results);

      // filter-out selected
      results = results.filter(excludeSelected);
      return results;
    };

    $scope.createActivity = function(){
      $location.path('/app/activities');
      $mdToast.show($mdToast.simple().content($scope.act.title+' activity created'));
    };

    $scope.getSportMatches = db.querySports;

    $scope.browseSports = function () {
      $mdToast.show($mdToast.simple().content('TODO Browse sports dialog.'));
    };

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

    $scope.visibilityButton = visibilityOptions[$scope.visibility];

    $scope.changeVisibility = function (r) {
      $scope.visibilityButton = visibilityOptions[r];
      $scope.visibility = r;
    };

    $scope.openVisibilityMenu = function ($mdOpenMenu, ev) {
      // Update menu entries before opening
      $scope.omitMenuVisibility = $scope.visibility;
      // Need to delay so menu updates before show
      $timeout(function () {
        $mdOpenMenu(ev);
      });
    };

  })

  .controller('DashboardCtrl', function ($scope, $timeout, $mdToast, inviters, myActivities, db) {
    // TODO which way to load data? resolve or db calls here?
    this.inviters = inviters;
    this.myActivities = myActivities;
    db.myActivities('==', 0).then(function (acts) {
        this.activityInvites = acts;
      }
    );

    $scope.$on('$ionicView.enter', function(){
      //$mdToast.show($mdToast.simple().content('Demonstrating material headers, possible performance issues.'));
    });
  })

  .controller('FriendsCtrl', function ($scope, $timeout, $ionicSideMenuDelegate,
                                       friends) {
    $scope.friends = friends;

    var delayedShowTooltips = function () {
      if($scope.isFabOpen){
        $scope.showActionTooltips = $scope.isFabOpen;
      }
    };

    $scope.$watch('isFabOpen', function(open){
      if(open){
        $timeout(delayedShowTooltips, 1000);
      }
      else{
        $scope.showActionTooltips = false;
      }
    });
  })

  .controller('FriendCtrl', function ($scope, $ionicPopover, friend) {
    $scope.friend = friend;
    //$ionicNavBarDelegate.title('Some Friend');

    /**
     * View all of this user's activity tags
     */
    $scope.viewActivityTags = function ($event) {
      $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
        $scope.popover.show($event);
      });
    }
  });

