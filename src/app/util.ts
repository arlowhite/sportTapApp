
// Modifying prototype seems messy and dangerous
//Array.prototype.remove = function (list: Array<any>, value: any) {
// Could extend, but our code does not always construct the array
//class MyArray<T> extends Array<T> {

// So just do a function

import {SportTapActivity} from "./services/SportTapDb";
/**
 * Remove the given object from the array.
 * @param array Array to remove from
 * @param value Value to remove
 * @returns {number} The indexOf the value removed, otherwise -1
 */
export function arrayRemove<T> (array: Array<T>, value: T): number {
  let i = array.indexOf(value);
  if (i >= 0) {
    array.splice(i, 1);
  }
  return i;
}

export function activitySortStartDate(a: SportTapActivity, b: SportTapActivity): number {
  return a.startUnix - b.startUnix;
}
