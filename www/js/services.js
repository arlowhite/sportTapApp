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
      },
      6: {
        id: 6,
        name: 'Arya',
        age: 15,
        gender: 'female',
        avatarUrl: 'img/demo/arya.jpg',
        city: 'Braavos',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Hiking, Running',
        activityTags: [
          {id:'hiking', name:'Hiking', num: 3},
          {id:'running', name:'Running', num: 3}
        ],
        nextActivityId: 1
      },
      7: {
        id: 7,
        name: 'Daenerys',
        age: 20,
        gender: 'female',
        avatarUrl: 'img/demo/daenerys.jpg',
        city: 'Meereen',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Hiking, Running',
        activityTags: [
          {id:'hiking', name:'Hiking', num: 3},
          {id:'running', name:'Running', num: 3}
        ]
      },
      8: {
        id: 8,
        name: 'Jon Snow',
        age: 20,
        gender: 'male',
        avatarUrl: 'img/demo/jon-snow.jpg',
        city: 'The Wall',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Hiking, Running',
        activityTags: [
          {id:'hiking', name:'Hiking', num: 3},
          {id:'running', name:'Running', num: 3}
        ]
      },
      9: {
        id: 9,
        name: 'Sansa',
        age: 17,
        gender: 'female',
        avatarUrl: 'img/demo/sansa.jpg',
        city: 'Winterfell',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Hiking, Running',
        activityTags: [
          {id:'hiking', name:'Hiking', num: 3},
          {id:'running', name:'Running', num: 3}
        ]
      },
      10: {
        id: 10,
        name: 'Tyrion',
        age: 37,
        gender: 'male',
        avatarUrl: 'img/demo/tyrion.jpg',
        city: 'King\'s Landing',
        // Server gives list of friend's top tags?
        // TODO activity tag chips conversion?
        mainActivityTags: 'Hiking, Running',
        activityTags: [
          {id:'hiking', name:'Hiking', num: 3},
          {id:'running', name:'Running', num: 3}
        ]
      }

    };
    var firstPersonId = 2;
    var lastPersonId = 10;

    var myPersonId = 3; // Arlo

    var fakeActivities=[
      {
        id: 1,
        title: "Scuba dive",
        locName: "Target rock",
        descr: "You must bring scuba gear. Make sure to rent gear from the shop before it closes at 6pm.",
        rsvps:[
          {pId:3, r:'going'},
          {pId:6, r:'going'},
          {pId:7, r:'going'},
          {pId:8, r:'going'},
          {pId:4, r:'maybe'},
          {pId:9, r:'maybe'},
          {pId:10, r:'no'}
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
          {pId:6, r:'maybe'},
          {pId:4, r:'no'},
          {pId:5, r:'?'}
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
          {pId:3, r:'going'},
          {pId:8, r:'maybe'},
          {pId:9, r:'maybe'}
        ],
        _daysAhead:1,
        _hoursAhead:19,
        _duration: 1.5
      },
      {
        id: 4,
        title: "Dragon riding lessons",
        locName: "Meereen dragon tower",
        descr: "Don't smell like meat.",
        rsvps:[
          {pId:7, r:'going'},
          {pId:10, r:'maybe'}
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


      var numGoing= 0, numMaybe= 0, numNo= 0, numUnknown=0;
      var rsvps = act.rsvps;
      for(var i=0; i<rsvps.length; i++){
        var r = rsvps[i].r;

        if(r=='going'){
          numGoing++;
        }
        else if(r=='maybe'){
          numMaybe++;
        }
        else if(r=='no'){
          numNo++;
        }
        else if(r=='?'){
          numUnknown++;
        }
        else{
          console.error('Bad RSVP response value', r, act);
        }
      }

      // TODO maybe notate calculated fields
      // could use convention to strip them before network?
      act.numRsvpGoing = numGoing;
      act.numRsvpMaybe = numMaybe;
      act.numRsvpNo = numNo;
      act.numRsvpUnknown = numUnknown;
      act.numRsvpPossible = numGoing + numMaybe + numUnknown;
    });
    fakeActivities.sort(sortActivityStartDate);

    // After sort, nextActivities will be in order by date
    fakeActivities.forEach(function (act) {
      var rsvps = act.rsvps;
      for(var i=0; i<rsvps.length; i++){
        // set person.nextActivities
        var rsvpPersonId = rsvps[i].pId;
        var person = fakeUsers[rsvpPersonId];
        if(!person.nextActivities){
          person.nextActivities = [];
        }
        person.nextActivities.push(act.id);

        if(rsvpPersonId == myPersonId){
          act.myRsvp = rsvps[i].r;
          console.log('myRsvp on', act);
        }
      }
    });

    var _myFriendsDef, _myActivities, _invitedMe;

    return {

      myId: function(){
        return myPersonId;
      },

      user: function (id) {
        var d = $q.defer();
        d.resolve(fakeUsers[id]);
        return d.promise;
      },

      activity: function(id) {
        for(var i=0; i<fakeActivities.length; i++){
          if(fakeActivities[i].id == id){
            return $q.when(fakeActivities[i]);
          }
        }
        // TODO correct response for not found?
        throw new Error('No Activity with ID '+id);
      },

      myFriends: function(){
        if(!_myFriendsDef) {
          _myFriendsDef = $q.defer();
          var list = [];
          for(var i=firstPersonId; i<=lastPersonId; i++){
            if(!fakeUsers[i].invitedYou) {
              list.push(fakeUsers[i]);
            }
          }
          _myFriendsDef.resolve(list);
        }
        return _myFriendsDef.promise;
      },

      invitedMe: function(){
        if(!_invitedMe){
          _invitedMe = $q.defer();
          var list = [];
          for(var i=firstPersonId; i<=lastPersonId; i++){
            if(fakeUsers[i].invitedYou) {
              list.push(fakeUsers[i]);
            }
          }
          _invitedMe.resolve(list);
        }
        return _invitedMe.promise;
      },

      // TODO myActivities filters. Going vs Maybe vs No vs ?
      myActivities: function () {
        if(!_myActivities){
          _myActivities = $q.defer();
          var myActs = fakeActivities.filter(function(act){
            return act.myRsvp;
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
