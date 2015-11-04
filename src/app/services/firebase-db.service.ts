import Firebase = require("firebase");
import {SportTapDb, SportTapPerson, SportTapActivity} from './SportTapDb';

export class SportTapFirebaseDb implements SportTapDb {

  private client: Firebase;
  private _myPersonKey: string;

  constructor(public hostname: string, public port: number,
              private $q: angular.IQService) {
    'ngInject';

    let client = this.client = new Firebase(`ws://${hostname}:${port}`);
    client.on('value', function(snap) {
      console.log('Got value:', snap.val());
    });

    var usersRef = client.child('users');
    var key = usersRef.push({
      name: 'Arlo',
      age: 29
    }).key();
    console.log('Arlo key: ', key);
    this._myPersonKey = key;
  }

  myId():number {
    return 3;
  }

  person(id:number):angular.IPromise<SportTapPerson> {
    var p = this.$q.defer();
    this.client.child('users').child(this._myPersonKey).once('value', snapshot => {
      p.resolve(snapshot.val());
    });
    return p.promise;
  }

  activity(id:number):angular.IPromise<SportTapActivity> {
    return undefined;
  }

  myFriends():angular.IPromise<SportTapPerson[]> {
    var def = this.$q.defer();
    this.client.child('users').once('value', snapshot => {
      var val = snapshot.val();
      console.log('HERE', val);
      def.resolve(val);
    });
    return def.promise;
  }

  invitedMe():angular.IPromise<SportTapPerson[]> {
    return undefined;
  }

  myActivities(operation:string, rsvp:number):angular.IPromise<SportTapActivity[]> {
    return undefined;
  }

  updateRsvp(activityId:number, rsvp:number) {
  }

  sportIcon(sportId:string):string {
    return undefined;
  }

  querySports(query:string):any[] {
    return undefined;
  }

}

export default SportTapFirebaseDb;
