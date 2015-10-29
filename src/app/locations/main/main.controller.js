define(["require", "exports"], function (require, exports) {
    var MainController = (function () {
        function MainController($state, $location) {
            'ngInject';
            this.$location = $location;
            this.$state = $state;
        }
        // TODO old tabNav code
        MainController.prototype.tabNav = function (name) {
            console.log('TABVNAV');
            /*
             TODO if start at detail view and change state, this creates a back state to that view
             Not sure if want to just clearHistory at that point
        
             This clears out view state (resets from tab detail view)
        
             */
            // if current location under tab
            if (this.$location.path().indexOf(name) != -1) {
                this.$state.go('app.' + name);
            }
            else {
                this.$location.path('/app/' + name);
            }
        };
        MainController.prototype.onTabSelected = function () {
            console.log('tabselect', this);
            //$ionicHistory
            var state = this.$location.state();
            console.log('state', state);
        };
        return MainController;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MainController;
});
//# sourceMappingURL=main.controller.js.map