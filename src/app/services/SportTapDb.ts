
type IPromise<T> = angular.IPromise<T>;

/*
Wanted to make interface take generic Promise type so could construct with different Deferred/Promise
implementations, but couldn't figure out how to make <Promise<T>> nested generic work.

So just use angular.IPromise since bluebird also implements then, catch, finally.
 */

export interface SportTapDb {

  myId(): string;
  person(id: string): IPromise<SportTapPerson>;

  createActivity(activity: SportTapActivity): IPromise<string>;
  activity(id: string): IPromise<SportTapActivity>;

  myFriends(): IPromise<SportTapPerson[]>;
  invitedMe(): IPromise<SportTapPerson[]>;
  myActivities(operation: string, rsvp: number): IPromise<SportTapActivity[]>;
  updateRsvp(activityId: string, rsvp: number);
  sportIcon(sportId: string): string;
  querySports(query: string): SportTapSportTag[];
}

export interface SportTapPerson {
  id: string;
  name: string;
  age?: number;
  gender: string;
  avatarUrl: string;
  city: string;
  mainActivityTags: string;
  activityTags: SportTapSportTag[];
  invitedYou?: boolean;

  nextActivityDate?: string;
  nextActivity?: string;
  nextActivityId?: string;
  nextActivities?: string[];
}

export interface SportTapActivity {
  id?: string;
  creatorId?: string;
  title: string;
  sport: string;
  locName: string;
  descr: string;
  rsvps: any[];
  startDate?: Date;
  startUnix?: number;
  endDate?: Date;
  endUnix?: number;

  // Needs to be optional because calculated in FakeDb, but maybe shouldn't be
  // could change to optional in extended interface?
  numRsvpGoing?: number;
  numRsvpMaybe?: number;
  numRsvpNo?: number;
  numRsvpUnknown?: number;
  numRsvpPossible?: number;

  myRsvp?: number;
}

export interface SportTapSportTag {
  id: string;
  name: string;
  // Ionic IonIcon for dev since more sports icons available.
  // optional since calculated in some code
  icon?: string;
  // FIXME meaningless sports number in user profiles
  num?: number;
}
