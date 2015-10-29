
import IPromise = angular.IPromise;

export interface SportTapDb {

  myId(): number;
  person(id: number): IPromise<SportTapPerson>;
  activity(id: number): IPromise<SportTapActivity>;
  myFriends(): IPromise<SportTapPerson[]>;
  invitedMe(): IPromise<SportTapPerson[]>;
  myActivities(operation: string, rsvp: number): IPromise<SportTapActivity[]>;
  updateRsvp(activityId: number, rsvp: number);
  sportIcon(sportId: string): string;
  // TODO merge with SportTapSportTag?
  querySports(query: string): any[];
}

export interface SportTapPerson {
  id: number;
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
  nextActivityId?: number;
  nextActivities?: number[];
}

export interface SportTapActivity {
  id: number;
  creatorId: number;
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
