
// TODO ngInject with annotations instead?
function runBlock ($log, $rootScope, $ionicConfig, $window) {
  'ngInject';
  let $ionicPlatform = ionic.Platform;
  $ionicPlatform.ready(function() {
    console.info('ionic ready; window=', $window);

    var jsScrolling = $ionicConfig.scrolling.jsScrolling();
    console.log('jsScrolling', jsScrolling);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // TODO remove Keyboard access hackish code.
    let Keyboard: any = $window.cordova ? $window.cordova.plugins.Keyboard : null;
    $rootScope.hasKeyboardPlugin = Keyboard !== null;
    if ($rootScope.hasKeyboardPlugin) {
      Keyboard.hideKeyboardAccessoryBar(true);
      // Disable native scrolling if jsScrolling
      Keyboard.disableScroll(jsScrolling);
    }
    if ($window.StatusBar) {
      // org.apache.cordova.statusbar required
      $window.StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.error('stateChangeError', arguments);
      });

    // Note: iOS cloud backup can backup localStorage, (config.xml preference disables)
    // http://learn.ionicframework.com/formulas/localstorage/
    // Don't use device UUID
    // https://www.nowsecure.com/resources/secure-mobile-development/handling-sensitive-data/limit-use-of-uuid/

  });

  $log.debug('runBlock end');
}

export default runBlock;
