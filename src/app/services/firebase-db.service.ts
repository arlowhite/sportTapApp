import Firebase = require("firebase");
import {SportTapDb, SportTapPerson, SportTapActivity} from './SportTapDb';
import IDeferred = angular.IDeferred;

export class SportTapFirebaseDb implements SportTapDb {

  private client: Firebase;
  private _myPersonKey: string;
  private deferredConstructor: <T>() => IDeferred<T>;

  constructor(public hostname: string, public port: number,
              deferredConstructor,
              firebase: FirebaseStatic = null) {
    'ngInject';

    this.deferredConstructor = deferredConstructor;

    if(firebase === null){
      console.log('Defaulting to Firebase from "firebase" module.');
      firebase = Firebase;
    }

    let client = this.client = new firebase(`ws://${hostname}:${port}`);
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
    var def = this.deferredConstructor<SportTapPerson>();
    this.client.child('users').child(this._myPersonKey).once('value', snapshot => {
      def.resolve(snapshot.val());
    });
    return def.promise;
  }

  activity(id:number):angular.IPromise<SportTapActivity> {
    return undefined;
  }

  myFriends():angular.IPromise<SportTapPerson[]> {
    var def = this.deferredConstructor<SportTapPerson[]>();
    this.client.child('users').once('value', snapshot => {
      def.resolve(snapshot.val());
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
