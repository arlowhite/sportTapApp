// Displays a list of activities
define(["require", "exports"], function (require, exports) {
    var ActivitiesListController = (function () {
        function ActivitiesListController($scope, $state, $timeout) {
            'ngInject';
            this.$scope = $scope;
            this.$timeout = $timeout;
            console.info($state.current);
        }
        ActivitiesListController.prototype.refresh = function () {
            //$http.get('/new-items')
            // .success(function(newItems) {
            //   $scope.items = newItems;
            // })
            // .finally(function() {
            // Stop the ion-refresher from spinning
            // FIXME example refresh
            var $scope = this.$scope;
            this.$timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 2000);
            //});
        };
        ;
        return ActivitiesListController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ActivitiesListController;
});
//# sourceMappingURL=activities-list.controller.js.map