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

  moveRight(blockMap) {
    const key = this.getFocusKey();
    const offset = this.getFocusOffset();

    const entityMap = blockMap.get(key);
    let nextOffset;
    if (key === offset) {
      // start of line.
      const first = entityMap._list.first();
      if (first) {
        nextOffset = first[0];
      }
    } else {
      const index = entityMap._map.get(offset);
      const next = entityMap._list.get(index + 1);
      if (next) {
        nextOffset = next[0];
      }
    }
    if (nextOffset) {
      return SelectionState.createFromPosition(key, nextOffset);
    }

    const index = blockMap._map.get(key);
    const next = blockMap._list.get(index + 1);
    if (!next) {
      return this;
    }
    return SelectionState.createFromPosition(next[0], next[0]);
  }

  moveLeft(blockMap) {
    const key = this.getFocusKey();
    const offset = this.getFocusOffset();

    if (key === offset) {
      // to above line.
      const index = blockMap._map.get(key);
      if (index === 0) {
        return this;
      }
      const last = blockMap._list.get(index - 1);
      const lastEntity = last[1]._list.last();
      if (lastEntity) {
        return SelectionState.createFromPosition(last[0], lastEntity[0]);
      }
      //empty line
      return SelectionState.createFromPosition(last[0], last[0]);
    }

    // move left in line.
    const entityMap = blockMap.get(key);
    const index = entityMap._map.get(offset);
    if (index > 0) {
      const lastEntity = entityMap._list.get(index - 1);
      return SelectionState.createFromPosition(key, lastEntity[0]);
    }
    // to line start.
    return SelectionState.createFromPosition(key, key);
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
