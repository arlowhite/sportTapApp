angular.module('sportSocial.controllers', ['ngMessages'])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet, $cordovaDatePicker, $ionicDeploy,
                                  $ionicPopup, $ionicLoading, ngProgressFactory, $ionicPlatform) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    //console.log(window.device.uuid);
    console.log('appctrl');

    // Ionic Deploy
    $scope.checkingUpdates = false;
    // TODO move to app.js run() ?
    $ionicPlatform.ready(function () {
      $ionicDeploy.setChannel("dev");

      // No deploy info unless wait for some reason.
      $timeout(function () {
        $ionicDeploy.info().then(function(deployInfo) {
          // deployInfo will be a JSON object that contains
          // information relating to the latest update deployed
          // on the device
          console.log('Delayed Deploy info: ' + angular.toJson(deployInfo));
          $scope.appVersion = deployInfo.binary_version;
        }, function() {
          console.error('Delayed, No deploy info 1');
        }, function() {
          console.error('Delayed, No deploy info 2');
        });
      }, 2000);
    });

    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function() {
      if($scope.doingUpdate){
        console.error('Already doingUpdate');
        return;
      }
      $scope.doingUpdate = true;
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner><p>Updating app...</p>'
      });

      // Progress bar needs to be added after dialog shows
      // Watching isShown seems like the best way, could also watch body.loading-active
      // Loader template promise
      $ionicLoading._getLoader()
        .then(function (loader) {
          var dereg = $scope.$watch(function () {
              return loader.isShown;
            }, function (val) {
              if(val){
                console.log('Adding progress to loader', loader.isShown);
                dereg();
                //Dialog box is the only child
                var box = loader.element.children()[0];
                var progressbar = ngProgressFactory.createInstance();
                progressbar.setParent(box);
                progressbar.setColor('#11c1f3'); // calm
                $scope.progressbar = progressbar;
              }
            }
          );
        });

      $ionicDeploy.update().then(function (res) {
        console.log('Ionic Deploy: Update Success! ', res);
        $scope.progressbar.complete();
        // Don't hide or set doingUpdate = false since rebooting now.
      }, function (err) {
        console.log('Ionic Deploy: Update error! ', err);
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Error updating!'
        });
        $scope.doingUpdate = false;
      }, function (prog) {
        // prog float 0 to 100
        if($scope.progressbar){
          $scope.progressbar.set(prog);
        }
      });

    };

    $scope.askToUpdate = function() {
      if (!$scope.hasUpdate){
        console.error('askToUpdate called, but no update available, checking instead.');
        $scope.checkForUpdates();
        return;
      }

      $ionicPopup.confirm({
        title: 'Update available',
        template: 'Update now and restart app?',
        okText: 'Update'
      })
        .then(function (res) {
          if (res) {
            $scope.doUpdate();
          }
        });
    };

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
      if($scope.checkingUpdates){
        return;
      }
      if($scope.hasUpdate){
        $scope.askToUpdate();
        return;
      }
      $scope.checkingUpdates = true;
      console.log('Ionic Deploy: Checking for updates');
      $ionicDeploy.check().then(function (hasUpdate) {
        $scope.checkingUpdates = false;
        console.log('Ionic Deploy: Update available: ' + hasUpdate);
        $scope.hasUpdate = hasUpdate;
        if (hasUpdate) {
          $scope.askToUpdate();
        }
        else {
          // Toast?
          $ionicPopup.alert({
            title: 'No update available.'
          });
        }

      }, function (err) {
        $scope.checkingUpdates = false;
        console.error('Ionic Deploy: Unable to check for updates', err);
        $ionicPopup.alert({
          title: 'Error checking for update.'
        });
      });
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

    $scope.showDatePicker = function () {
      var options = {
        date: new Date(),
        mode: 'date', // or 'time'
        minDate: new Date() - 10000,
        allowOldDates: true,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
      };
      // Need to check ready?
      $cordovaDatePicker.show(options).then(function (date) {
        alert(date);
      });
    };
  })


  .controller('ActivitiesTabsCtrl', function($scope, $state, $timeout, $ionicPlatform) {
    //$scope.$watch('selectedIndex', function (current, old, childScope) {
    //  console.log('watch.selectedIndex', current, childScope);
    //  // FIXME use ion-nav-view or not?
    //  //http://ionicframework.com/docs/api/directive/ionNavView/
    //  //childScope.content = 'Foo';
    //  //$state.go('app.activities.friends');
    //});

    $scope.mineSelected = function () {
      console.log('mineSelected', arguments);
    }
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

  .controller('CreateActivityCtrl', function ($scope, db, $q, $mdToast, $location) {
    $scope.act = {invited: []};

    $scope.today = new Date();

    //$scope.$watch('act', function () {
    //  console.log(arguments);
    //});

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

  .controller('AccountCtrl', function ($scope) {
    $scope.wantFriends = true;
  })

  .controller('DashboardCtrl', function ($scope, $timeout, $mdToast, inviters) {
    $scope.inviters = inviters;

    $scope.$on('$ionicView.enter', function(){
      $mdToast.show($mdToast.simple().content('Demonstrating material headers, possible performance issues.'));
    });

    $scope.activity = {rsvp: {
      label: 'Going',
      icon: 'done',
      buttonClass: 'md-primary'
    }};

    $scope.rsvp = function(label, icon, buttonClass) {
      console.log('rsvp', arguments);
      $scope.activity.rsvp.label = label;
      $scope.activity.rsvp.icon = icon;
      $scope.activity.rsvp.buttonClass = buttonClass;
    };

    $scope.openActivityDetail = function () {
      $mdToast.show($mdToast.simple().content('TODO: Activity detail view.'));
    };

    var originatorEv; // Example uses to pop dialog from menu button
    // https://material.angularjs.org/latest/#/demo/material.components.menu
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

  })

  .controller('FriendsCtrl', function ($scope, $timeout, friends) {
    $scope.friends = friends;

    $scope.hideFab = function(hide){
      console.log('hideFab', hide);
      // Maybe works fine on mobile?
      //if(hide){
      //  $scope.isFabOpen = false;
      //}
    };

    var delayedShowTooltips = function () {
      if($scope.isFabOpen){
        $scope.showActionTooltips = $scope.isFabOpen;
      }
    };

    $scope.$watch('isFabOpen', function(open){
      console.log('isfab', arguments);
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

