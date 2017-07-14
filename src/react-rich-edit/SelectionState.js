/**
 * Created by DengYun on 2017/7/14.
 */

import { Record, OrderedMap } from 'immutable';

const SelectionStateRecord = Record({
  anchorKey: '',
  anchorOffset: 0,
  focusKey: '',
  focusOffset: 0,
});

export default class SelectionState extends SelectionStateRecord {
  static createFromPosition(key, offset) {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: offset,
      focusKey: key,
      focusOffset: offset,
    });
  }
}
