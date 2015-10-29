define(["require", "exports"], function (require, exports) {
    var HomeController = (function () {
        function HomeController($scope, $timeout, $mdToast, inviters, myActivities, db) {
            'ngInject';
            var _this = this;
            // TODO which way to load data? resolve or db calls here?
            this.inviters = inviters;
            this.myActivities = myActivities;
            db.myActivities('==', 0).then(function (acts) {
                _this.activityInvites = acts;
            });
            //$scope.$on('$ionicView.enter', function () {
            //$mdToast.show($mdToast.simple().content('Demonstrating material headers, possible performance issues.'));
            //});
        }
        return HomeController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HomeController;
});
//# sourceMappingURL=home.controller.js.map