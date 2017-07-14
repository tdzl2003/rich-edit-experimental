/**
 * Created by DengYun on 2017/7/14.
 */

import { Record, List, OrderedMap } from 'immutable';
import SelectionState from "./SelectionState";

const ContentStateRecord = Record({
  blockMap: OrderedMap([['0', List()]]),
  selectionList: List([SelectionState.createFromPosition('0', 0)]),
  keyCounter: 0,
});

export default class ContentState extends ContentStateRecord {

  // Getters
  getBlockMap() {
    return this.get('blockMap');
  }

  getSelectionList() {
    return this.get('selectionList');
  }


  // Factories

  static createEmpty() {
    return new ContentState();
  }

  static createWithText(text) {
    // TODO: Implement me.
    throw new Error('Not Implemented yet.');
  }
}
