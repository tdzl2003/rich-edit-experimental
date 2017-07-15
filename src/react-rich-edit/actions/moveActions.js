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

// return null means not found..
function find_first_in_range(start, end, condition) {
  let haveFit = false;
  for (;end - start > 1;) {
    const m = ((end + start) / 2 ) | 0;
    if (condition(m - 1)) {
      haveFit = true;
      end = m;
    } else {
      start = m;
    }
  }

  if (end > start && (haveFit || condition(start))) {
    return start;
  }
  return null;
}

function find_lowerest(start, end, value) {
  return find_first_in_range(start, end, i => i === end - 1 || value(i + 1) > value(i));
}

function moveDownCursor(selection, blockMap, queryPosition) {
  let key = selection.getFocusKey();
  let offset = selection.getFocusOffset();
  let line = blockMap.get(key);

  const [left, top, height] = queryPosition(key, offset);
  let currIndex = offset === key ? -1 : line._map.get(offset);

  // find first entity in next line.
  let currLineCount = line.count();

  currIndex = find_first_in_range(currIndex + 1, currLineCount, index => {
    const [myLeft, myTop, myHeight] = queryPosition(key, line._list.get(index)[0]);
    return myHeight ? (myTop >= top + height) : (myTop > top + height);
  });

  if (currIndex === null) {
    // will goto next block.
    let lineIndex = blockMap._map.get(key);
    let nextLine = blockMap._list.get(lineIndex + 1);
    if (!nextLine) {
      // Current is the last line. return with no modifies.
      return selection;
    }
    [key, line] = nextLine;
    currLineCount = line.count();
    currIndex = -1;
  }

  const [currLeft, currTop, currHeight] = queryPosition(key, currIndex === -1 ? key : line._list.get(currIndex)[0]);

  currIndex = find_lowerest(currIndex, currLineCount, index => {
    const [myLeft, myTop, myHeight] = queryPosition(key, index === -1 ? key : line._list.get(index)[0]);

    if (myHeight ? (myTop >= currTop + currHeight) : (myTop > currTop + currHeight)) {
      return 10000000 + index;
    }
    return Math.abs(myLeft - left);
  })

  return SelectionState.createFromPosition(key, currIndex === -1 ? key : line._list.get(currIndex)[0]);
}

function moveUpCursor(selection, blockMap, queryPosition) {
  let key = selection.getFocusKey();
  let offset = selection.getFocusOffset();
  let line = blockMap.get(key);

  const [left, top, height] = queryPosition(key, offset);
  let currIndex = offset === key ? -1 : line._map.get(offset);

  let currLineCount = line.count();

  // find last entry in below line. This cannot be line start.
  if (currIndex >= 0) {
    const d = find_first_in_range(1, currIndex + 1, diff => {
      const index = currIndex - diff;
      const [myLeft, myTop, myHeight] = queryPosition(key, line._list.get(index)[0]);
      return height ? (top >= myTop + myHeight) : (top > myTop + myHeight);
    });
    if (d === null) {
      currIndex = null;
    } else {
      currIndex -= d;
    }
  } else {
    currIndex = null;
  }

  if (currIndex === null) {
    // will goto above block.
    let lineIndex = blockMap._map.get(key);
    if (lineIndex === 0) {
      // Current is the first line. return with no modifies.
      return selection;
    }
    [key, line] = blockMap._list.get(lineIndex - 1);
    currLineCount = line.count();
    currIndex = currLineCount - 1;
  }

  const [currLeft, currTop, currHeight] = queryPosition(key, currIndex === -1 ? key : line._list.get(currIndex)[0]);

  currIndex -= find_lowerest(0, currIndex + 1, diff => {
    const index = currIndex - diff;
    const [myLeft, myTop, myHeight] = queryPosition(key, index === -1 ? key : line._list.get(index)[0]);

    if (currHeight ? (currTop >= myTop + myHeight) : (currTop > myTop + myHeight)) {
      return 10000000 + diff;
    }
    return Math.abs(myLeft - left);
  });

  return SelectionState.createFromPosition(key, currIndex === -1 ? key : line._list.get(currIndex)[0]);
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
