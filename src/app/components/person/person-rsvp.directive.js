define(["require", "exports"], function (require, exports) {
    function ssPersonRsvp(db, $state) {
        'ngInject';
        return {
            restrict: "E",
            scope: {
                rsvp: "="
            },
            templateUrl: "app/components/person/person-rsvp.html",
            link: function (scope, element, attrs) {
                db.person(scope.rsvp.pId).then(function (p) {
                    scope.person = p;
                });
                scope.goToPerson = function () {
                    $state.go('app.friend_detail', { friendId: scope.person.id });
                };
            }
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ssPersonRsvp;
});
//# sourceMappingURL=person-rsvp.directive.js.map