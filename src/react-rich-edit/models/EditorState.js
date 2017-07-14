/**
 * Created by DengYun on 2017/7/14.
 */

import { Record, Stack } from 'immutable';
import ContentState from "./ContentState";

const EditorStateRecord = Record({
  currentContent: ContentState.createEmpty(),
  undoStack: Stack(),
  redoStack: Stack(),
});

export default class EditorState extends EditorStateRecord {
  // Getters
  getCurrentContent() {
    return this.get('currentContent');
  }

  getUndoStack() {
    return this.get('undoStack');
  }

  getRedoStack() {
    return this.get('redoStack');
  }

  // Actions
  modifyContent(reducer) {
    const oldContent = this.getCurrentContent();
    const currentContent = reducer(oldContent);
    return this.merge({
      currentContent,
      undoStack: this.getUndoStack().shift(oldContent),
    });
  }

  // Factories
  static createEmpty() {
    return new EditorState();
  }

  static createWithText(text) {
    return EditorState.createWithContentState(ContentState.createWithText(text));
  }

  static createWithContentState(contentState) {
    return new EditorState({
      currentContent: contentState,
    });
  }
}
