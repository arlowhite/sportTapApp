
import {SportTapActivity} from "../../services/SportTapDb";
import {arrayRemove, activitySortStartDate} from "../../util";


class HomeController {

  private inviters;
  private myActivities;
  private activityInvites;

  constructor($scope, $timeout, $mdToast, inviters, myActivities, db) {
    'ngInject';

    // TODO which way to load data? resolve or db calls here?
    this.inviters = inviters;
    this.myActivities = myActivities;
    db.myActivities('==', 0).then(acts => {
      this.activityInvites = acts;
    });

    //$scope.$on('$ionicView.enter', function () {
      //$mdToast.show($mdToast.simple().content('Demonstrating material headers, possible performance issues.'));
    //});
  }

  /**
   * Removes the Activity from the specified section if Not Going (rsvp == 1)
   * @param activity
   * @param rsvp
   * @param section
     */
  onRsvp (activity: SportTapActivity, rsvp: number, section: string) {
    console.log(activity, rsvp, section);
    if (rsvp === 1) {
      // Not Going, remove from list
      let list: Array<SportTapActivity> = this[section];
      let removedIndex = arrayRemove(list, activity);
      if (removedIndex === -1) {
        console.error('onRsvp 1, removing Activity from list, but not found', list);
      }
    }
    else if (section == 'activityInvites') {
      // User decided Yes or Maybe to Activity Invite, move to myActivities (Upcoming)
      arrayRemove(this.activityInvites, activity);
      this.myActivities.push(activity);
      this.myActivities.sort(activitySortStartDate);
    }
  }
}

export default HomeController;
