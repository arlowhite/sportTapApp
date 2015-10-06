angular.module('sportSocial.controllers', ['ngMessages'])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    //console.log(window.device.uuid);

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
        db.myActivities().then(function (acts) {
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

    var tabUrl = $state.current.url;
    if (tabUrl=='/mine') {
      $scope.activities = [
        {title: 'Scuba Diving', id: 1},
        {title: 'Ultimate frisbee', id: 2}
      ];
      // Duplicate 2 * 10
      var nextId = 3;
      for(var i=0; i<20; i++){
        $scope.activities.push({title:'Another one', id:nextId});
        nextId++;
      }

    }
    else{
      $scope.activities = [
        {title: 'Soccer', id: 1},
        {title: 'Basketball', id: 2}
      ];
    }

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

    $scope.$on('$ionicView.afterEnter', function(){
      // People take a long time to load
      $scope.viewEntered = true;
    });

    // TODO share RSVP button/menu code with ssActivityCard
    var rsvpDisplay = {
      'going': {
        label: 'Going',
        icon: 'done',
        buttonClass: 'md-primary'
      },
      'maybe': {
        label: 'Maybe',
        icon: 'help',
        buttonClass: ''
      },
      'no': {
        label: 'Not Going',
        icon: 'thumb_down',
        buttonClass: 'md-warn'
      }
    };
    var myId = db.myId();
    var act = activity;
    if(act.myRsvp) {
      $scope.rsvpButton = rsvpDisplay[act.myRsvp];

      $scope.changeRsvp = function (r) {
        $scope.rsvpButton = rsvpDisplay[r];
        $scope.activity.myRsvp = r;
        // Update within rsvps as well
        var rsvps = $scope.activity.rsvps;

        var found = false;
        for(var i=0; i<rsvps.length;i++){
          if(rsvps[i].pId == myId){
            rsvps[i].r = r;
            found = true;
            break;
          }
        }
        if(!found){
          console.error('Failed to find matching RSVP for person/activity', myId, $scope.activity.id);
          console.log(rsvps);
        }
      };

      $scope.openRsvpMenu = function ($mdOpenMenu, ev) {
        // Update menu entries before opening
        $scope.omitMenuRsvp = $scope.activity.myRsvp;
        // Need to delay so menu updates before show
        $timeout(function () {
          $mdOpenMenu(ev);
        });
      };
    }
  })

  .controller('CreateActivityCtrl', function ($scope, db, $q, $mdToast, $location) {
    $scope.act = {invited: []};

    $scope.today = new Date();

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
        return (contact._lowername.indexOf(lowercaseQuery) != -1);;
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

  })

  .controller('AccountCtrl', function ($scope, $mdDialog, $timeout, $document, $animate, $mdToast,
                                       $ionicScrollDelegate, $ionicPosition) {
    $scope.wantFriends = true;
    $scope.editingProfile = false;

    $animate.on('enter', document.getElementById('location-container'),
      function callback(element, phase) {
        // fires initially when loading, so check element id
        console.log('animate enter!', element, phase);
        // called twice, phase='start', phase='close' duration defined by CSS animations
        // Focus after animation is done
        if(element[0].id=='location-editor'){
          console.log('focus editor!');

          if (phase=='start') {
            //var h = element[0].offsetHeight;
            // 78 initially, then 128, so may as well hardcode in CSS for now
            $timeout(function () {
              // focus at start looks fine
              document.getElementById('profile-location').focus();
            }, 200);
          }
          else if(phase=='close'){
            // TODO only scroll on mobile
            var inputContainer = document.getElementById('profile-location').parentNode;
            //console.log(inputContainer);
            //var pos = ionic.DomUtil.getPositionInParent(inputContainer);
            // $ionicPosition needs an angular.element
            var element = angular.element(inputContainer);
            // offset is relative to scroll
            var pos = $ionicPosition.offset(element);
            //var pos = $ionicPosition.offset(inputContainer);
            console.log('scrolling to ', pos);
            // Need to subtract header height (44) plus a couple more pixels
            $ionicScrollDelegate.scrollBy(0, pos.top - 52, true);
          }
        }

      }
    );

    $scope.showLocationEditor = function (ev) {
      if($scope.editingLocation || !$scope.editingProfile){
        return;
      }
      console.log('showLocationEditor');
      // Tried this to prevent auto-focus being undone. Fixed with $timeout focus()
      //ev.preventDefault();
      //ev.stopPropagation();
      $scope.editingLocation=true;
      // animate.enter will be called now.
    };

    $scope.editingProfileChanged = function (value) {
      // For some reason, md-switch is not updating the Controller's $scope
      // So for now, just do this workaround
      if($scope.editingProfile != value){
        console.log('switch changed, but did not update editingProfile, forcing to', value);
        $scope.editingProfile = value;
      }
      else {
        // Bug fixed upstream?
        console.warn('Remove this switch onchange code');
      }

      // Close all open editors
      if(!value){
        if($scope.editingLocation){
          $scope.hideLocationEditor();
        }
      }
    };

    $scope.hideLocationEditor = function (ev) {
      $scope.editingLocation = false;
      // Prevent click on buttons from triggering item click and showLocationEditor()
      if(ev){
        ev.preventDefault();
        ev.stopPropagation();
      }
    };

    window.addEventListener('native.keyboardshow', function (e) {
      //e.keyboardHeight
      if ($scope.pendingDialog){
        console.log('KeyboardShow, showing pendingDialog');
        $scope.pendingDialog();
      }
    });

    $scope.editName = function (ev) {
      console.log('editName, editingProfile', $scope.editingProfile);
      if(!$scope.editingProfile){
        // Shouldn't happen
        console.warn('Not editingProfile, return!');
        return;
      }
      var confirm = $mdDialog.confirm()
        .title('Change your name')
        .content('<md-input-container><input id="profile-name" type="text" aria-label="New name" value="Arlo White" md-autofocus></md-input-container>')
        .ariaLabel('Change your name')
        .targetEvent(ev)
        .ok('Save')
        .cancel('Cancel');

      // Hackish, but works
      confirm._options.clickOutsideToClose = true;

      // Looks best to force show keyboard, then open dialog
      $scope.pendingDialog = function() {
        $mdDialog.show(confirm).then(function () {
          $scope.status = 'You decided to get rid of your debt.';
        }, function () {
          $scope.status = 'You decided to keep your debt.';
        });
        delete $scope.pendingDialog;
      };

      function checkPendingDialog() {
        if ($scope.pendingDialog) {
          console.log('No KeyboardShow in time, showing pendingDialog');
          $scope.pendingDialog();
        }
      }

      if($scope.hasKeyboardPlugin){
        console.log('showing keyboard before dialog');
        cordova.plugins.Keyboard.show();
        // Keyboard can fail to show if already open due to editing another field
        // It will hide instead during blur and never show
        $timeout(checkPendingDialog, 1000);
      }
      else {
        $scope.pendingDialog();
      }

      // Needed without md-autofocus
      //$timeout(function () {
        //document.getElementById('profile-name').focus();
      //});
    }

  })

  .controller('DashboardCtrl', function ($scope, $timeout, $mdToast, inviters, myActivities) {
    $scope.inviters = inviters;
    $scope.myActivities = myActivities;

    $scope.$on('$ionicView.enter', function(){
      $mdToast.show($mdToast.simple().content('Demonstrating material headers, possible performance issues.'));
    });
  })

  .controller('FriendsCtrl', function ($scope, $timeout, $ionicSideMenuDelegate,
                                       friends) {
    $scope.friends = friends;

    // Hide tooltips if side menu is opened
    $scope.$watch(function () {
      return $ionicSideMenuDelegate.isOpen();
    }, function(isOpen) {
      if(isOpen){
        $scope.isFabOpen = false;
      }
    });

    var delayedShowTooltips = function () {
      if($scope.isFabOpen && !$ionicSideMenuDelegate.isOpen()){
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

