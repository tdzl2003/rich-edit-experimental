/**
 * Created by tdzl2003 on 2017/7/15.
 */

import SelectionState from "../models/SelectionState";
import {CharEntity} from "../models/ContentState";
function removeContentForSelection(blockMap, selection) {
  //TODO: implement me.
  return [blockMap, selection];
}

function splitBlockAtSelection(blockMap, selection, keyCounter) {
  const key = selection.getFocusKey();
  const offset = selection.getFocusOffset();
  const lineIndex = blockMap._map.get(key);
  const line = blockMap.get(key);
  const offsetIndex = offset === key ? 0 : line._map.get(offset) + 1;
  const beforeCursor = line.slice(0, offsetIndex);
  const afterCursor = line.slice(offsetIndex);
  const newKey = (++keyCounter).toString(36);

  const blocksBefore = blockMap.slice(0, lineIndex);
  const blocksAfter = blockMap.slice(lineIndex + 1);

  const newBlocks = blocksBefore.concat(
    [[key, beforeCursor], [newKey, afterCursor]],
    blocksAfter,
  );

  return [newBlocks, SelectionState.createFromPosition(newKey, newKey), keyCounter];
}

function addCharAtSelection(blockMap, selection, keyCounter, ch) {
  const key = selection.getFocusKey();
  const offset = selection.getFocusOffset();

  const line = blockMap.get(key);
  const newKey = (++keyCounter).toString(36);

  const offsetIndex = offset === key ? 0 : line._map.get(offset) + 1;
  const beforeCursor = line.slice(0, offsetIndex);
  const afterCursor = line.slice(offsetIndex);

  const newLine = beforeCursor.concat(
    [[newKey, CharEntity.fromChar(ch)]],
    afterCursor,
  );

  const newBlocks = blockMap.set(key, newLine);

  return [newBlocks, SelectionState.createFromPosition(key, newKey), keyCounter];
}

function addTextAtSelection(blockMap, selection, keyCounter, text) {
  // TODO: Optimize: do split & concat only once.
  for (const ch of text) {
    if (ch === '\n') {
      [blockMap, selection, keyCounter] = splitBlockAtSelection(blockMap, selection, keyCounter);
    } else {
      [blockMap, selection, keyCounter] = addCharAtSelection(blockMap, selection, keyCounter, ch);
    }
  }
  return [blockMap, selection, keyCounter];
}

function insertText(editorState, text) {
  return editorState.modifyContent(content => {
    let blockMap = content.getBlockMap();
    let keyCounter = content.getKeyCounter();

    let selectionList = content.getSelectionList();
    selectionList = selectionList.map(selection => {
      [blockMap, selection] = removeContentForSelection(blockMap, selection);
      [blockMap, selection, keyCounter] = addTextAtSelection(blockMap, selection, keyCounter, text);
      return selection;
    });

    return content.merge({
      blockMap,
      selectionList,
      keyCounter,
    });
  });
}

export default {
  'edit.insertText': insertText,
}
