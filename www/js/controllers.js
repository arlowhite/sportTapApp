angular.module('sportSocial.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet, $cordovaDatePicker) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

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

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login-dialog.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

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
    }

    $scope.$on('$destroy', function() {
      $scope.addActivityModal.remove();
      $scope.inviteFriendsModal.remove();
      $scope.modal.remove();
    });

    $scope.devCommentary = false;
    $scope.toggleDevCommentary = function () {
      $scope.devCommentary = !$scope.devCommentary;
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
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
