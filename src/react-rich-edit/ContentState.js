/**
 * Created by DengYun on 2017/7/14.
 */

import React from 'react';
import { Record, List, OrderedMap } from 'immutable';
import SelectionState from "./SelectionState";

const CharEntityRecord = Record({
  // TODO: styles.
  char: ' ',
});

export class CharEntity extends CharEntityRecord{

  getChar() {
    return this.get('char');
  }

  renderJSX() {
    return (<span>{this.getChar()}</span>)
  }

  static fromChar(char) {
    return new CharEntity({char});
  }
}

const ContentStateRecord = Record({
  blockMap: OrderedMap([['0', OrderedMap()]]),
  selectionList: List([SelectionState.createFromPosition('0', '0')]),
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
    let keyCounter = 0;

    let line = OrderedMap();
    let blockMap = OrderedMap();
    for (const ch of text) {
      if (ch === '\n') {
        blockMap = blockMap.set((++keyCounter).toString(36), line);
        line = OrderedMap();
      } else {
        line = line.set((++keyCounter).toString(36), CharEntity.fromChar(ch));
      }
    }
    blockMap = blockMap.set((++keyCounter).toString(36), line);

    return new ContentState({
      blockMap,
      selectionList: List([SelectionState.createStartPointOfBlocks(blockMap)]),
      keyCounter,
    });
    // throw new Error('Not Implemented yet.');
  }
}
