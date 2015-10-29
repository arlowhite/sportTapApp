// from http://learn.ionicframework.com/formulas/localstorage/
define(["require", "exports"], function (require, exports) {
    var LocalStorage = (function () {
        function LocalStorage($window) {
            'ngInject';
            this.localStorage = $window.localStorage;
            console.log('new LocalStorage');
        }
        LocalStorage.prototype.set = function (key, value) {
            this.localStorage[key] = value;
        };
        LocalStorage.prototype.get = function (key, defaultValue) {
            return this.localStorage[key] || defaultValue;
        };
        LocalStorage.prototype.setObject = function (key, value) {
            this.localStorage[key] = JSON.stringify(value);
        };
        LocalStorage.prototype.getObject = function (key) {
            return JSON.parse(this.localStorage[key] || '{}');
        };
        return LocalStorage;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LocalStorage;
});
//# sourceMappingURL=localStorage.service.js.map