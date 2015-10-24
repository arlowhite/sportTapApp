class AccountController {
  constructor($mdDialog, $timeout, $animate, $scope,
              $ionicScrollDelegate, $ionicPosition, $window) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;

    console.log('AccountController constructor!');
    // TODO use $scope or put profile under accountCtrl?
    $scope.profile = {wantFriends: true};
    this.editingProfile = false;

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

    $window.addEventListener('native.keyboardshow', function (e) {
      //e.keyboardHeight
      if (this.pendingDialog) {
        console.log('KeyboardShow, showing pendingDialog');
        this.pendingDialog();
      }
    });

  }

  editingProfileChanged(value) {
    // For some reason, md-switch is not updating the Controller's this
    // So for now, just do this workaround
    if (this.editingProfile != value) {
      console.log('switch changed, but did not update editingProfile, forcing to', value);
      this.editingProfile = value;
    }
    else {
      // Bug fixed upstream?
      console.warn('Remove this switch onchange code');
    }

    // Close all open editors
    if (!value) {
      if (this.editingLocation) {
        this.hideLocationEditor();
      }
    }
  }

  showLocationEditor(ev) {
    if (this.editingLocation || !this.editingProfile) {
      return;
    }
    console.log('showLocationEditor');
    // Tried this to prevent auto-focus being undone. Fixed with $timeout focus()
    //ev.preventDefault();
    //ev.stopPropagation();
    this.editingLocation = true;
    // animate.enter will be called now.
  }

  hideLocationEditor (ev) {
    this.editingLocation = false;
    // Prevent click on buttons from triggering item click and showLocationEditor()
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  editName (ev) {
    var self = this;
    var $mdDialog = self.$mdDialog;
    var $timeout = self.$timeout;

    console.log('editName, editingProfile', this.editingProfile);
    if (!this.editingProfile) {
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
    this.pendingDialog = function () {
      $mdDialog.show(confirm).then(function () {
        // clicked ok
      }, function () {
        // canceled
      });
      delete self.pendingDialog;
    };

    function checkPendingDialog() {
      if (self.pendingDialog) {
        console.log('No KeyboardShow in time, showing pendingDialog');
        self.pendingDialog();
      }
    }

    if (this.hasKeyboardPlugin) {
      console.log('showing keyboard before dialog');
      cordova.plugins.Keyboard.show();
      // Keyboard can fail to show if already open due to editing another field
      // It will hide instead during blur and never show
      $timeout(checkPendingDialog, 1000);
    }
    else {
      this.pendingDialog();
    }

    // Needed without md-autofocus
    //$timeout(function () {
    //document.getElementById('profile-name').focus();
    //});
  }

}

export default AccountController;
