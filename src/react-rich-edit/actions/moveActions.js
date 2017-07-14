/**
 * Created by tdzl2003 on 2017/7/15.
 */


function moveRight(editorState) {
  return editorState.modifyContent(content => {
    const blockMap = content.getBlockMap();

    return content.modifyAllSelection(selection => {
      return selection.moveRight(blockMap);
    })
  });
}

function moveLeft(editorState) {
  return editorState.modifyContent(content => {
    const blockMap = content.getBlockMap();

    return content.modifyAllSelection(selection => {
      return selection.moveLeft(blockMap);
    })
  });
}

export default {
  'cursor.moveRight': moveRight,
  'cursor.moveLeft': moveLeft,
}
