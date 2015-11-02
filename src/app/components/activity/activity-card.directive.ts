
function activityCardDirective($state, db, $q) {
  'ngInject';

  var secondsInDay = 24 * 60 * 60;

  return {
    restrict: "E",
    scope: {
      activity: "=",
      onRsvp: "&"
    },
    templateUrl:"app/components/activity/activity-card.html",

    link: function(scope, element, attrs) {
      var actReady;

      if(attrs.activityId){
        if(scope.activity){
          console.warn('activity and activityId both defined!');
        }
        actReady = db.activity(attrs.activityId);
      }
      else{
        actReady = $q.when(scope.activity);
      }

      actReady.then(function (act) {
        if(!scope.activity){
          scope.activity = act;
        }

        db.person(act.creatorId).then(function (p) {
          scope.creator = p;
        });

        scope.sportIcon = db.sportIcon(act.sport);

        // Determining this should be efficient and day property is brittle
        // Sep 8 to Oct 8
        // FIXME 10pm to 2am next day
        scope.multiday = act.endUnix - act.startUnix > secondsInDay;

        // activity.myRsvp set if user RSVP'd to this Activity
        // rsvpButton - Current button styling/label
        // omitMenuRsvp - hides entry from menu (avoid user seeing menu change)
        if(act.myRsvp >= 0) {

          scope.$watch('activity.myRsvp', function (newVal, oldVal) {
            if(newVal !== oldVal){
              db.updateRsvp(act.id, newVal);
              scope.onRsvp({rsvp: newVal, activity: act});
            }
          });
        }

        scope.openActivityDetail = function () {
          $state.go('app.activity_detail', {activityId: scope.activity.id});
        };
      });

    }
  }
}

export default activityCardDirective;
