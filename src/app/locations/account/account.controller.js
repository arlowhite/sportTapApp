class AccountController {
  constructor($scope, $mdDialog, $timeout, $document, $animate, $mdToast,
              $ionicScrollDelegate, $ionicPosition) {
    'ngInject';

    console.log('AccountController constructor!');
    // FIXME move to this
    $scope.wantFriends = true;
    $scope.editingProfile = false;

    $animate.on('enter', document.getElementById('location-container'),
      function callback(element, phase) {
        // fires initially when loading, so check element id
        console.log('animate enter!', element, phase);
        // called twice, phase='start', phase='close' duration defined by CSS animations
        // Focus after animation is done
        if (element[0].id == 'location-editor') {
          console.log('focus editor!');

          if (phase == 'start') {
            //var h = element[0].offsetHeight;
            // 78 initially, then 128, so may as well hardcode in CSS for now
            $timeout(function () {
              // focus at start looks fine
              document.getElementById('profile-location').focus();
            }, 200);
          }
          else if (phase == 'close') {
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
      if ($scope.editingLocation || !$scope.editingProfile) {
        return;
      }
      console.log('showLocationEditor');
      // Tried this to prevent auto-focus being undone. Fixed with $timeout focus()
      //ev.preventDefault();
      //ev.stopPropagation();
      $scope.editingLocation = true;
      // animate.enter will be called now.
    };

    $scope.editingProfileChanged = function (value) {
      // For some reason, md-switch is not updating the Controller's $scope
      // So for now, just do this workaround
      if ($scope.editingProfile != value) {
        console.log('switch changed, but did not update editingProfile, forcing to', value);
        $scope.editingProfile = value;
      }
      else {
        // Bug fixed upstream?
        console.warn('Remove this switch onchange code');
      }

      // Close all open editors
      if (!value) {
        if ($scope.editingLocation) {
          $scope.hideLocationEditor();
        }
      }
    };

    $scope.hideLocationEditor = function (ev) {
      $scope.editingLocation = false;
      // Prevent click on buttons from triggering item click and showLocationEditor()
      if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    };

    window.addEventListener('native.keyboardshow', function (e) {
      //e.keyboardHeight
      if ($scope.pendingDialog) {
        console.log('KeyboardShow, showing pendingDialog');
        $scope.pendingDialog();
      }
    });

    $scope.editName = function (ev) {
      console.log('editName, editingProfile', $scope.editingProfile);
      if (!$scope.editingProfile) {
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
      $scope.pendingDialog = function () {
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

      if ($scope.hasKeyboardPlugin) {
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

  }
}

export default AccountController;
