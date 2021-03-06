/**
 * Created by DengYun on 2017/7/14.
 */

import { Record, OrderedMap } from 'immutable';

// key: Key of the block
// offset: Key of the entity before cursor, or key of the block if start of line.
const SelectionStateRecord = Record({
  anchorKey: '',
  anchorOffset: 0,
  focusKey: '',
  focusOffset: 0,
});

export default class SelectionState extends SelectionStateRecord {
  // Getter
  getAnchorKey() {
    return this.get('anchorKey');
  }

  getAnchorOffset() {
    return this.get('anchorOffset');
  }

  getFocusKey() {
    return this.get('focusKey');
  }

  getFocusOffset() {
    return this.get('focusOffset');
  }



  // Factories
  static createFromPosition(key, offset) {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: offset,
      focusKey: key,
      focusOffset: offset,
    });
  }

  static createStartPointOfBlocks(blockMap) {
    const [key, value] = blockMap._list.first();
    return SelectionState.createFromPosition(key, key);
  }
}
