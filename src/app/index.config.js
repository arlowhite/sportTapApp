define(["require", "exports"], function (require, exports) {
    var momentDateParseFormats = ['MMM-DD-YYYY', 'dddd, MMMM Do'];
    function config($logProvider, $ionicConfigProvider, $mdGestureProvider, $ionicPlatform, $mdDateLocaleProvider, $mdThemingProvider) {
        'ngInject';
        $logProvider.debugEnabled(true);
        // Disable caching, RSVP changes were not updating between views
        $ionicConfigProvider.views.maxCache(0);
        // Native scrolling recommended by:
        // http://julienrenaux.fr/2015/08/24/ultimate-angularjs-and-ionic-performance-cheat-sheet/
        // http://blog.ionic.io/native-scrolling-in-ionic-a-tale-in-rhyme/
        // TODO iOS works or not? Fallsback?
        // Disables browser pull-refresh
        // Doesn't seem smoother in Android...
        if ($ionicPlatform.isAndroid()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }
        //$mdThemingProvider.theme('default');
        // FIXME need skipClickHijack?
        // http://forum.ionicframework.com/t/is-there-a-tutorial-for-using-ionic-and-angular-material/14662/23
        $mdGestureProvider.skipClickHijack();
        $mdDateLocaleProvider.parseDate = function (dateString) {
            return moment(dateString, momentDateParseFormats).toDate();
        };
        // May not be used at all since handleInputEvent overridden above.
        $mdDateLocaleProvider.isDateComplete = function () {
            // moment handles parsing and validity is checked anyway
            return true;
        };
        $mdDateLocaleProvider.formatDate = function (date) {
            if (!date) {
                return '';
            }
            return moment(date).format('dddd, MMMM Do');
        };
        // Put Android tabs on bottom instead of top, no striped
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
        $mdThemingProvider.theme('default')
            .accentPalette('blue');
        //.primaryPalette('cyan') ugly :(
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});
//# sourceMappingURL=index.config.js.map