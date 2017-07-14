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
  // Getters & Setters
  getCurrentContent() {
    return this.get('currentContent');
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
