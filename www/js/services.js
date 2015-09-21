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

    var myPersonId = 3; // Arlo

    var fakeActivities=[
      {
        id: 1,
        title: "Scuba dive",
        locName: "Target rock",
        descr: "You must bring scuba gear. Make sure to rent gear from the shop before it closes at 6pm.",
        rsvps:[
          {pId:3, r:'going'},
          {pId:4, r:'maybe'}
        ],
        _daysAhead:2,
        _hoursAhead:9,
        _duration: 2
      },
      {
        id: 2,
        title: "Backpacking South Sister",
        locName: "Deschutes National Wilderness",
        descr: "1 night backpacking trip. Remember to go over the checklist.",
        rsvps:[
          {pId:2, r:'going'},
          {pId:3, r:'maybe'},
          {pId:4, r:'maybe'},
          {pId:5, r:'going'}
        ],
        _daysAhead:7,
        _hoursAhead:7,
        _duration: 35
      },
      {
        id: 3,
        title: "2 mile run",
        locName: "Madonna lemon loop",
        descr: "Jog about 2 miles on the Madonna lemon trail network.",
        rsvps:[
          {pId:2, r:'going'},
          {pId:3, r:'going'}
        ],
        _daysAhead:1,
        _hoursAhead:19,
        _duration: 1.5
      }
    ];

    function sortActivityStartDate(a, b) {
      return a.startUnix - b.startUnix;
    }

    fakeActivities.forEach(function (act) {
      var date = moment();
      date.startOf('day'); // 12am
      date.add(act._daysAhead, 'days');
      date.add(act._hoursAhead, 'hours');
      act.startUnix = date.unix();
      act.startDate = date.toDate();
      date = date.clone();
      date.add(act._duration, 'hours');
      act.endUnix = date.unix();
      act.endDate = date.toDate();
      console.log(act);
    });
    fakeActivities.sort(sortActivityStartDate);

    var _myFriendsDef, _myActivities;

    return {
      user: function (id) {
        var d = $q.defer();
        d.resolve(fakeUsers[id]);
        return d.promise;
      },

      myFriends: function(){
        if(!_myFriendsDef) {
          _myFriendsDef = $q.defer();
          var list = [];
          list.push(fakeUsers[2]);
          list.push(fakeUsers[3]);
          _myFriendsDef.resolve(list);
        }
        return _myFriendsDef.promise;
      },

      invitedMe: function(){
        return $q.when([
          fakeUsers[4],
          fakeUsers[5]
        ]);
      },

      myActivities: function () {
        if(!_myActivities){
          _myActivities = $q.defer();
          var myActs = fakeActivities.filter(function(act){
            return act.rsvps.some(function (rsvp) {
              if(rsvp.pId == myPersonId){
                // My RSVP
                act.rsvp = rsvp.r;
                return true;
              }
              return false;
            })
          });
          myActs.sort(sortActivityStartDate);
          _myActivities.resolve(myActs);
        }
        return _myActivities.promise;
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
