angular.module('sportSocial.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet, $cordovaDatePicker, $ionicDeploy,
                                  $ionicPopup, $ionicLoading, ngProgressFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Ionic Deploy
    $ionicDeploy.setChannel("dev");
    $scope.checkingUpdates = false;

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
    $ionicModal.fromTemplateUrl('templates/create_activity.html', {
      scope: $scope
      //animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addActivityModal = modal;
    });

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

    $scope.addActivity = function(){
      $scope.addActivityModal.show();
    };

    $scope.inviteFriends = function () {
      $scope.inviteFriendsModal.show();
    };

    $scope.$on('$destroy', function() {
      $scope.addActivityModal.remove();
      $scope.inviteFriendsModal.remove();
      $scope.modal.remove();
    });

    $scope.devCommentary = false;
    $scope.toggleDevCommentary = function () {
      $scope.devCommentary = !$scope.devCommentary;
    };

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



  // Displays a list of activities
  .controller('ActivitiesCtrl', function($scope, $state, $timeout) {
    console.info($state.current);
    var tabUrl = $state.current.url;
    if (tabUrl=='/mine') {
      $scope.activities = [
        {title: 'Scuba Diving', id: 1},
        {title: 'Ultimate frisbee', id: 2}
      ];
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

  // FIXME modal controller?
  .controller('CreateActivityCtrl', function ($scope, $cordovaDatePicker, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      alert('ready!')
    });
//deviceready
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.wantFriends = true;
  })

  .controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 },
      {title: 'Foo', id: 7},
      {title: 'Bar', id: 8}
    ];
  })

  .controller('PlaylistCtrl', function($scope, $stateParams) {
  });
