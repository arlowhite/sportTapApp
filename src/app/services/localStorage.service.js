
// from http://learn.ionicframework.com/formulas/localstorage/
class LocalStorage {

  constructor($window) {
    'ngInject';
    this.localStorage = $window.localStorage;
    console.log('new LocalStorage');
  }

  set (key, value) {
    this.localStorage[key] = value;
  }
  get (key, defaultValue) {
    return this.localStorage[key] || defaultValue;
  }
  setObject (key, value) {
    this.localStorage[key] = JSON.stringify(value);
  }
  getObject (key) {
    return JSON.parse(this.localStorage[key] || '{}');
  }
}

export default LocalStorage;
