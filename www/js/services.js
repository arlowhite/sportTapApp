angular.module('sportSocial.services', [])

.factory('db', function ($q) {

    var fakeUsers = {
      2: {
        id: 2,
        name: 'Raquel',
        //age: 30, null?
        gender: 'female',
        avatarUrl: 'img/demo/raquel_avatar.png',
        city: 'San Luis Obispo, CA',
        // Server gives list of friend's top tags?
        mainActivityTags: 'Road Biking, Mountain Biking, Running',
        activityTags: [
          {id:'road-biking', name:'Road Biking', num: 24},
          {id:'mountain-biking', name:'Mountain Biking', num: 13},
          {id:'running', name:'Running', num: 7}
        ],
        nextActivityDate: 'Weekend',
        nextActivity: 'Road ride to Pismo'
      },
      3: {
        id: 3,
        name: 'Arlo White',
        age: 30,
        gender: 'male',
        avatarUrl: 'img/demo/scuba_avatar.jpg',
        city: 'Corvallis, OR',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Scuba Diving, Rock Climbing, Hiking',
        activityTags: [
          {id:'scuba-diving', name:'Scuba Diving', num: 4},
          {id:'rock-climbing', name:'Rock Climbing', num: 3},
          {id:'hiking', name:'Hiking', num: 7},
          {id:'mountain-biking', name:'Mountain Biking', num: 3},
          {id:'frisbee-golf', name:'Frisbee Golf', num: 1},
          {id:'backpacking', name:'Backpacking', num: 2}
        ],
        nextActivityDate: 'Saturday 8-11am',
        nextActivity: 'Scuba Diving @ Morro Bay',
        // TODO how to encode relational objects? user <> activities
        // Look at how Firebase, Couchbase do it with their APIs
        //nextActivities: [
        //  {}
        //]
      },
      4: {
        id: 4,
        name: 'Tully',
        age: 24,
        gender: 'male',
        avatarUrl: 'img/demo/tully.jpg',
        city: 'Corvallis, OR',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Rock Climbing, Hiking',
        activityTags: [
          {id:'rock-climbing', name:'Rock Climbing', num: 4},
          {id:'hiking', name:'Hiking', num: 3}
        ],
        // TODO think about how best to encode invitedYou
        invitedYou: true
      },
      5: {
        id: 5,
        name: 'Dana',
        age: 25,
        gender: 'female',
        avatarUrl: 'img/demo/barrett.jpg',
        city: 'Corvallis, OR',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Hiking, Running',
        activityTags: [
          {id:'hiking', name:'Hiking', num: 3},
          {id:'running', name:'Running', num: 3}
        ],
        invitedYou: true
      }
    };

    return {
      user: function (id) {
        var d = $q.defer();
        d.resolve(fakeUsers[id]);
        return d.promise;
      },

      myFriends: function(){
        var d = $q.defer();
        var list = [];
        list.push(fakeUsers[2]);
        list.push(fakeUsers[3]);
        d.resolve(list);
        return d.promise;
      },

      invitedMe: function(){
        return $q.when([
          fakeUsers[4],
          fakeUsers[5]
        ]);
      }

    }
})

// from http://learn.ionicframework.com/formulas/localstorage/
.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
