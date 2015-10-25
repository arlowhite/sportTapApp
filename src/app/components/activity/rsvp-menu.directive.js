
var rsvpDisplay = {
  3: {
    label: 'Going',
    icon: 'done',
    buttonClass: 'md-primary'
  },
  2: {
    label: 'Maybe',
    icon: 'help',
    buttonClass: ''
  },
  1: {
    label: 'Not Going',
    icon: 'thumb_down',
    buttonClass: 'md-warn'
  },
  0: {
    label: 'RSVP',
    icon: 'help',
    buttonClass: ''
  }
};

function rsvpMenu($timeout) {
  return {
    restrict: "E",
    scope: {
      rsvpValue: "=",
      buttonClass: "@"
    },
    templateUrl: "app/components/activity/rsvp-menu.html",

    link: function (scope, element, attrs) {
      scope.rsvpButton = rsvpDisplay[scope.rsvpValue];

      scope.changeRsvp = function (r) {
        scope.rsvpButton = rsvpDisplay[r];
        scope.rsvpValue = r;
      };

      scope.openRsvpMenu = function ($mdOpenMenu, ev) {
        // Update menu entries before opening
        scope.omitMenuRsvp = scope.rsvpValue;
        // Need to delay so menu updates before show
        $timeout(function () {
          $mdOpenMenu(ev);
        });
      };
    }
  }
}

export default rsvpMenu;
