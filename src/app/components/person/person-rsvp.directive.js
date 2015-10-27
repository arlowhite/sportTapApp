function ssPersonRsvp (db, $state) {
  'ngInject';

  return {
    restrict: "E",
    scope: {
      rsvp: "="
    },
    templateUrl:"app/components/person/person-rsvp.html",
    link: function(scope, element, attrs) {
      db.person(scope.rsvp.pId).then(function (p) {
        scope.person = p;
      });

      scope.goToPerson = function () {
        $state.go('app.friend_detail', {friendId: scope.person.id});
      }
    }
  }
}

export default ssPersonRsvp;
