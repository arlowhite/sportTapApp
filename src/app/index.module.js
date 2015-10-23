import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';
import monkeyPatch from './monkeypatch'

import MainController from './locations/main/main.controller';
import AccountController from './locations/account/account.controller';

monkeyPatch();

//angular.module('angularGulpIonicBoilerplate', ['ionic', 'ui.router'])
angular.module('sportSocial', ['ionic', 'ngMaterial'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)

  .controller('MainController', MainController)
  .controller('AccountController', AccountController);
