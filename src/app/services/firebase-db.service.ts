import Firebase = require("firebase");
import {SportTapDb, SportTapPerson, SportTapActivity} from './SportTapDb';
import IDeferred = angular.IDeferred;

type IPromise<T> = angular.IPromise<T>;

export class SportTapFirebaseDb implements SportTapDb {

  public client: Firebase;
  //private _myUserKey: string;
  private deferredConstructor: <T>() => IDeferred<T>;

  public activitiesRef: Firebase;

  constructor(public hostname: string, public port: number,
              deferredConstructor,
              firebase: FirebaseStatic = null) {
    'ngInject';

    //this._myUserKey = null;
    this.deferredConstructor = deferredConstructor;

    if(firebase === null){
      console.log('Defaulting to Firebase from "firebase" module.');
      firebase = Firebase;
    }

    let client = this.client = new firebase(`ws://${hostname}:${port}`);

    client.onAuth(function(authData){
      console.log('onAuth', authData);
      //this._myUserKey
    }, this);

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
    //if (this._myUserKey === null) {
    //  throw new Error('Not authenticated!');
    //}
    //return this._myUserKey;
    return this.client.getAuth().uid;
  }

  person(id:string): IPromise<SportTapPerson> {
    var def = this.deferredConstructor<SportTapPerson>();
    this.client.child('users').child(this.myId()).once('value', snapshot => {
      def.resolve(snapshot.val());
    });
    return def.promise;
  }

  createActivity(activity:SportTapActivity): IPromise<string> {
    if(activity.hasOwnProperty('id')) {
      throw new Error('Activity.id already exists');
    }

    // Rules verify that this is the current user'd UID
    activity.creatorId = this.myId();

    const def = this.deferredConstructor<string>();
    const key = this.activitiesRef.push(activity, (error) => {
      if (error) {
        def.reject(error);
      }
      def.resolve(key);
    }).key();
    return def.promise;
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
