
import {SportTapDb, SportTapActivity, SportTapPerson, SportTapSportTag} from "./SportTapDb";
import {activitySortStartDate} from "../util";

type IPromise<T> = angular.IPromise<T>;

var ionIconForSport = {
  soccer: 'ion-ios-football',
  football: 'ion-ios-americanfootball',
  baseball: 'ion-ios-baseball-outline',
  biking: 'ion-android-bicycle',
  hiking: 'ion-android-walk',
  flying: 'ion-jet',
  yoga: 'ion-ios-body',
  scuba: 'ion-ios-body'
};

var fakeUsers: {[personId: string]: SportTapPerson} = {
  '2': {
    id: '2',
    name: 'Raquel',
    //age: 30, null?
    gender: 'female',
    avatarUrl: 'assets/images/demo/raquel_avatar.png',
    city: 'San Luis Obispo, CA',
    // Server gives list of friend's top tags?
    mainActivityTags: 'Road Biking, Mountain Biking, Running',
    activityTags: [
      {id: 'road-biking', name: 'Road Biking', num: 24},
      {id: 'mountain-biking', name: 'Mountain Biking', num: 13},
      {id: 'running', name: 'Running', num: 7}
    ],
    nextActivityDate: 'Weekend',
    nextActivity: 'Road ride to Pismo'
  },
  '3': {
    id: '3',
    name: 'Arlo White',
    age: 30,
    gender: 'male',
    avatarUrl: 'assets/images/demo/scuba_avatar.jpg',
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
  '4': {
    id: '4',
    name: 'Tully',
    age: 24,
    gender: 'male',
    avatarUrl: 'assets/images/demo/tully.jpg',
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
  '5': {
    id: '5',
    name: 'Dana',
    age: 25,
    gender: 'female',
    avatarUrl: 'assets/images/demo/barrett.jpg',
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
  '6': {
    id: '6',
    name: 'Arya',
    age: 15,
    gender: 'female',
    avatarUrl: 'assets/images/demo/arya.jpg',
    city: 'Braavos',
    // Server gives list of friend's top tags?
    // TODO activity tag chips conversion?
    mainActivityTags: 'Fencing, Spying',
    activityTags: [
      {id:'fencing', name:'Fencing', num: 3},
      {id:'spying', name:'Spying', num: 3}
    ],
    nextActivityId: '1'
  },
  '7': {
    id: '7',
    name: 'Daenerys',
    age: 20,
    gender: 'female',
    avatarUrl: 'assets/images/demo/daenerys.jpg',
    city: 'Meereen',
    // Server gives list of friend's top tags?
    // TODO activity tag chips conversion?
    mainActivityTags: 'Dragon Riding, Hiking, Running',
    activityTags: [
      {id:'dragon', name:'Dragon Riding', num: 12},
      {id:'hiking', name:'Hiking', num: 3},
      {id:'running', name:'Running', num: 3}
    ]
  },
  '8': {
    id: '8',
    name: 'Jon Snow',
    age: 20,
    gender: 'male',
    avatarUrl: 'assets/images/demo/jon-snow.jpg',
    city: 'The Wall',
    // Server gives list of friend's top tags?
    // TODO activity tag chips conversion?
    mainActivityTags: 'Archery, Cross-country Skiing',
    activityTags: [
      {id:'archery', name:'Archery', num: 3},
      {id:'cc-ski', name:'Cross-country Skiing', num: 3}
    ]
  },
  '9': {
    id: '9',
    name: 'Sansa',
    age: 17,
    gender: 'female',
    avatarUrl: 'assets/images/demo/sansa.jpg',
    city: 'Winterfell',
    // Server gives list of friend's top tags?
    // TODO activity tag chips conversion?
    mainActivityTags: 'Sailing, Hiking, Running',
    activityTags: [
      {id:'sailing', name:'Sailing', num: 7},
      {id:'hiking', name:'Hiking', num: 3},
      {id:'running', name:'Running', num: 3}
    ]
  },
  '10': {
    id: '10',
    name: 'Tyrion',
    age: 37,
    gender: 'male',
    avatarUrl: 'assets/images/demo/tyrion.jpg',
    city: 'King\'s Landing',
    // Server gives list of friend's top tags?
    // TODO activity tag chips conversion?
    mainActivityTags: 'Boxing, Sailing',
    activityTags: [
      {id:'boxing', name:'Boxing', num: 3},
      {id:'sailing', name:'Sailing', num: 7}
    ]
  }

};
const firstPersonId = 2;
const lastPersonId = 10;

const myPersonId = '3'; // Arlo

/**
 * Add fields used to generate dates in the future.
 */
interface FakeSportTapActivity extends SportTapActivity {
  _daysAhead: number;
  _hoursAhead: number;
  _duration: number;
}

var fakeActivities: FakeSportTapActivity[] = [
  {
    id: '1',
    creatorId: '3',
    title: "Scuba dive",
    sport: "scuba",
    locName: "Target rock",
    descr: "You must bring scuba gear. Make sure to rent gear from the shop before it closes at 6pm.",
    rsvps:[
      {pId:'3', r:'3'},
      {pId:'6', r:'3'},
      {pId:'7', r:'3'},
      {pId:'8', r:'3'},
      {pId:'4', r:'2'},
      {pId:'10', r:'1'}
    ],
    _daysAhead:2,
    _hoursAhead:9,
    _duration: 2
  },
  {
    id: '2',
    creatorId: '2',
    title: "Backpacking South Sister",
    sport: 'hiking',
    locName: "Deschutes National Wilderness",
    descr: "1 night backpacking trip. Remember to go over the checklist.",
    rsvps:[
      {pId:'2', r:'3'},
      {pId:'3', r:'2'},
      {pId:'6', r:'2'},
      {pId:'4', r:'1'},
      {pId:'5', r:'0'}
    ],
    _daysAhead:7,
    _hoursAhead:7,
    _duration: 35
  },
  {
    id: '3',
    creatorId: '2',
    title: "2 mile run",
    sport: "hiking",
    locName: "Madonna lemon loop",
    descr: "Jog about 2 miles on the Madonna lemon trail network.",
    rsvps:[
      {pId:'2', r:'3'},
      {pId:'3', r:'0'},
      {pId:'8', r:'2'}
    ],
    _daysAhead:1,
    _hoursAhead:19,
    _duration: 1.5
  },
  {
    id: '4',
    creatorId: '7',
    title: "Dragon riding lessons",
    sport: "flying",
    locName: "Meereen dragon tower",
    descr: "Don't smell like meat.",
    rsvps:[
      {pId:'7', r:'3'},
      {pId:'10', r:'2'}
    ],
    _daysAhead:1,
    _hoursAhead:19,
    _duration: 1.5
  }
];

fakeActivities.forEach( (act: FakeSportTapActivity) => {
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
  for(let rsvp of rsvps){
    var r = rsvp.r;

    if(r==3){
      numGoing++;
    }
    else if(r==2){
      numMaybe++;
    }
    else if(r==1){
      numNo++;
    }
    else if(r==0){
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
fakeActivities.sort(activitySortStartDate);

// After sort, nextActivities will be in order by date
fakeActivities.forEach( (act: FakeSportTapActivity) => {
  var rsvps = act.rsvps;
  for (let rsvp of rsvps) {
    // set person.nextActivities
    var rsvpPersonId = rsvp.pId;
    var person = fakeUsers[rsvpPersonId];
    if (!person.nextActivities) {
      person.nextActivities = [];
    }
    person.nextActivities.push(act.id);

    if (rsvpPersonId === myPersonId) {
      act.myRsvp = rsvp.r;
      console.log('myRsvp on', act);
    }
  }
});

var _myFriendsDef, _myActivities, _invitedMe;

class FakeDbService implements SportTapDb {

  constructor (private $q) {
    'ngInject';
    "use strict";
    this.$q = $q;
  }

  myId (): string{
    return myPersonId;
  }

  person  (id: string) {
    return this.$q.when(fakeUsers[id]);
  }

  createActivity(activity:SportTapActivity): IPromise<string> {
    throw new Error('not implemented');
  }

  activity (id: string) {
    for(let act of fakeActivities){
      if(act.id == id){
        if (act.id !== id) {
          console.warn('Inexact match on Activity.id', act.id, id);
        }
        return this.$q.when(act);
      }
    }
    // TODO correct response for not found?
    throw new Error('No Activity with ID '+id);
  }

  myFriends (){
    if(!_myFriendsDef) {
      _myFriendsDef = this.$q.defer();
      var list = [];
      for(var i=firstPersonId; i<=lastPersonId; i++){
        if(!fakeUsers[i].invitedYou) {
          list.push(fakeUsers[i]);
        }
      }
      _myFriendsDef.resolve(list);
    }
    return _myFriendsDef.promise;
  }

  invitedMe (){
    if(!_invitedMe){
      _invitedMe = this.$q.defer();
      var list = [];
      for(var i=firstPersonId; i<=lastPersonId; i++){
        if(fakeUsers[i].invitedYou) {
          list.push(fakeUsers[i]);
        }
      }
      _invitedMe.resolve(list);
    }
    return _invitedMe.promise;
  }

  // TODO myActivities filters. Going vs Maybe vs No vs ?

  /**
   * Activities user has an association with.
   * Created, Joined, Invited
   * @param op Comparison operation, ==, >=, <=
   * @param rsvp RSVP filter, undefined matches any.
   * @returns {*}
   */
  myActivities  (op, rsvp) {
    var myActs = fakeActivities.filter(function(act){
      if (!act.hasOwnProperty('myRsvp')) {
        return false;
      }
      if (op === '=='){
        return act.myRsvp === rsvp;
      }
      else if (op === '>=') {
        return act.myRsvp >= rsvp;
      }
      else if (op === '>=') {
        return act.myRsvp >= rsvp;
      }
      else {
        throw new Error('op not supported: '+op);
      }
    });
    myActs.sort(activitySortStartDate);
    return this.$q.when(myActs);
  }

  /**
   * Update user's RSVP for an Activity
   * @param activityId
   * @param newRsvp
   */
  updateRsvp (activityId, newRsvp) {
    console.log('db.updateRsvp', activityId, newRsvp);
    this.activity(activityId).then(function (act) {
      var found = false;
      for(let rsvp of act.rsvps){
        if(rsvp.pId === myPersonId){
          rsvp.r = newRsvp;
          found = true;
          break;
        }
      }
      if(!found){
        console.error('Failed to find matching RSVP for person/activity', myPersonId, act.id);
        console.log(act.rsvps);
      }
    });
  }

  // TODO remove this method?
  sportIcon (sportId) {
    // For now, just use ion icons since it has a few sports
    return ionIconForSport[sportId];
  }

  querySports (text): SportTapSportTag[] {
    if(!text) {
      return [];
    }
    var lowerQuery = text.toLowerCase();
    let results: SportTapSportTag[] = [];
    for(let key in ionIconForSport) {
      if (key.indexOf(lowerQuery) !== -1) {
        results.push({
          icon: ionIconForSport[key],
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1)
        });
      }
    }
    return results;
  }

}

export default FakeDbService;
