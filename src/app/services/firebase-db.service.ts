import Firebase = require("firebase");
import {SportTapDb, SportTapPerson, SportTapActivity} from './SportTapDb';
import IDeferred = angular.IDeferred;

type IPromise<T> = angular.IPromise<T>;

export class SportTapFirebaseDb implements SportTapDb {

  public client: Firebase;
  private _myPersonKey: string;
  private deferredConstructor: <T>() => IDeferred<T>;

  private activitiesRef: Firebase;

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

    // Just for convenience and to prevent typos in the future
    // looking at source, .child() is fairly heavy, validation and new Firebase.
    this.activitiesRef = client.child('activities');

  }

  /*
   For now, just call Firebase directly, an extra layer is not necessary, doesn't add any value
   except to wrap the return in a Promise.
    */
  //createUser(email: string, password: string): IPromise<Firebase...> {}

  myId():string {
    return '3';
  }

  person(id:string): IPromise<SportTapPerson> {
    var def = this.deferredConstructor<SportTapPerson>();
    this.client.child('users').child(this._myPersonKey).once('value', snapshot => {
      def.resolve(snapshot.val());
    });
    return def.promise;
  }

  // TODO decide on API, Promise, callback, how to capture key?
  createActivity(activity:SportTapActivity) {
    this.activitiesRef.push(activity, function () {
      console.log('activity saved in DB', arguments);
    });
    // 2nd arg, onComplete
    // Object mutated?
    //.key();
  }

  activity(id:string): IPromise<SportTapActivity> {
    return undefined;
  }

  myFriends(): IPromise<SportTapPerson[]> {
    var def = this.deferredConstructor<SportTapPerson[]>();
    this.client.child('users').once('value', snapshot => {
      def.resolve(snapshot.val());
    });
    return def.promise;
  }

  invitedMe(): IPromise<SportTapPerson[]> {
    return undefined;
  }

  myActivities(operation:string, rsvp:number): IPromise<SportTapActivity[]> {
    return undefined;
  }

  updateRsvp(activityId:string, rsvp:number) {
  }

  sportIcon(sportId:string):string {
    return undefined;
  }

  querySports(query:string):any[] {
    return undefined;
  }

}

export default SportTapFirebaseDb;
