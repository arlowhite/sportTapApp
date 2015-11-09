
import IPromise = angular.IPromise;

/*
Wanted to make interface take generic Promise type so could construct with different Deferred/Promise
implementations, but couldn't figure out how to make <Promise<T>> nested generic work.

So just use angular.IPromise since bluebird also implements then, catch, finally.
 */

export interface SportTapDb {

  myId(): string;
  person(id: string): IPromise<SportTapPerson>;

  createActivity(activity: SportTapActivity);
  activity(id: string): IPromise<SportTapActivity>;

  myFriends(): IPromise<SportTapPerson[]>;
  invitedMe(): IPromise<SportTapPerson[]>;
  myActivities(operation: string, rsvp: number): IPromise<SportTapActivity[]>;
  updateRsvp(activityId: string, rsvp: number);
  sportIcon(sportId: string): string;
  // TODO merge with SportTapSportTag?
  querySports(query: string): any[];
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
  id: string;
  creatorId: string;
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

interface SportTapSportTag {
  id: string;
  name: string;
  // FIXME meaningless, better name
  num: number;
}
