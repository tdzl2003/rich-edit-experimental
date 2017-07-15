/**
 * Created by tdzl2003 on 2017/7/15.
 */

import SelectionState from "../models/SelectionState";

function moveRightCursor(selection, blockMap) {
  const key = selection.getFocusKey();
  const offset = selection.getFocusOffset();

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
    return selection;
  }
  return SelectionState.createFromPosition(next[0], next[0]);
}

function moveLeftCursor(selection, blockMap) {
  const key = selection.getFocusKey();
  const offset = selection.getFocusOffset();

  if (key === offset) {
    // to above line.
    const index = blockMap._map.get(key);
    if (index === 0) {
      return selection;
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

function moveDownCursor(selection, blockMap, queryPosition) {
  let key = selection.getFocusKey();
  let offset = selection.getFocusOffset();
  let line = blockMap.get(key);

  const [left, top] = queryPosition(key, offset);
  let currIndex = offset === key ? -1 : line._map.get(offset);

  // find first entity in next line.
  let currLeft = left, currTop = top;

  let currLineCount = line.count();
  for (currIndex++;currIndex < currLineCount; currIndex++) {
    const myOffset = line._list.get(currIndex)[0]
    const [myLeft, myTop] = queryPosition(key, myOffset);
    let isNewLine = (myLeft < currLeft || (myLeft === currLeft && myTop > currTop));
    currLeft = myLeft;
    currTop = myTop;
    if (isNewLine) {
      offset = myOffset;
      break;
    }
  }
  if (currIndex >= currLineCount) {
    // will goto next line.
    let lineIndex = blockMap._map.get(key);
    let nextLine = blockMap._list.get(lineIndex + 1);
    if (!nextLine) {
      // Current is the last line. return with no modifies.
      return selection;
    }
    [key, line] = nextLine;
    [currLeft, currTop] = queryPosition(key, key);
    currLineCount = line.count();
    currIndex = -1;
    offset = key;
  }

  for (currIndex++;currIndex < currLineCount; currIndex++) {
    const myOffset = line._list.get(currIndex)[0];
    const [myLeft, myTop] = queryPosition(key, myOffset);
    let isNewLine = (myLeft < currLeft || (myLeft === currLeft && myTop > currTop));
    if (isNewLine || Math.abs(myLeft - left) > Math.abs(currLeft - left)) {
      // last one is better. return it.
      return SelectionState.createFromPosition(key, offset);
    }
    currLeft = myLeft;
    currTop = myTop;
    offset = myOffset;
  }

  return SelectionState.createFromPosition(key, offset);
}

function moveUpCursor(selection, blockMap, queryPosition) {
  let key = selection.getFocusKey();
  let offset = selection.getFocusOffset();
  let line = blockMap.get(key);

  const [left, top] = queryPosition(key, offset);
  let currIndex = offset === key ? -1 : line._map.get(offset);

  // find last entity in below line.
  let currLeft = left, currTop = top;

  let currLineCount = line.count();
  // last entity in below line cannot be start point of this line.
  for (currIndex--;currIndex >= 0; currIndex--) {
    const myOffset = line._list.get(currIndex)[0];
    const [myLeft, myTop] = queryPosition(key, myOffset);
    let isNewLine = (myLeft > currLeft || (myLeft === currLeft && myTop < currTop));
    currLeft = myLeft;
    currTop = myTop;
    if (isNewLine) {
      offset = myOffset;
      break;
    }
  }
  if (currIndex < 0) {
    // will goto last line.
    let lineIndex = blockMap._map.get(key);
    if (lineIndex === 0) {
      // Current is the first line. return with no modifies.
      return selection;
    }
    [key, line] = blockMap._list.get(lineIndex - 1);
    offset = line._list.get(-1)[0];

    [currLeft, currTop] = queryPosition(key, offset);
    currLineCount = line.count();
    currIndex = currLineCount - 1;
  }

  for (currIndex--;currIndex >= -1; currIndex--) {
    const myOffset = currIndex >= 0 ? line._list.get(currIndex)[0] : key;
    const [myLeft, myTop] = queryPosition(key, myOffset);
    let isNewLine = (myLeft > currLeft || (myLeft === currLeft && myTop < currTop));
    if (isNewLine || Math.abs(myLeft - left) > Math.abs(currLeft - left)) {
      // last one is better. return it.
      return SelectionState.createFromPosition(key, offset);
    }
    currLeft = myLeft;
    currTop = myTop;
    offset = myOffset;
  }

  return SelectionState.createFromPosition(key, offset);
}

export function mergeSelections(contentState) {
  //TODO: implement me.
  return contentState;
}

function moveRight(editorState) {
  return editorState.modifyContent(content => {
    const blockMap = content.getBlockMap();

    return content.modifyAllSelection(selection => {
      return moveRightCursor(selection, blockMap);
    })
  });
}

function moveLeft(editorState) {
  return editorState.modifyContent(content => {
    const blockMap = content.getBlockMap();

    return content.modifyAllSelection(selection => {
      return moveLeftCursor(selection, blockMap);
    })
  });
}

function moveDown(editorState) {
  return editorState.modifyContent(content => {
    const blockMap = content.getBlockMap();

    return mergeSelections(content.modifyAllSelection(selection => {
      return moveDownCursor(selection, blockMap, this.contentLayer.queryPosition);
    }));
  });
}

function moveUp(editorState) {
  return editorState.modifyContent(content => {
    const blockMap = content.getBlockMap();

    return mergeSelections(content.modifyAllSelection(selection => {
      return moveUpCursor(selection, blockMap, this.contentLayer.queryPosition);
    }));
  });
}


export default {
  'cursor.moveRight': moveRight,
  'cursor.moveLeft': moveLeft,
  'cursor.moveDown': moveDown,
  'cursor.moveUp': moveUp,
}
