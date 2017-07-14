/**
 * Created by DengYun on 2017/7/14.
 */
import React, { Component } from 'react';
import { RichEditor, EditorState } from 'react-rich-edit';

export default class App extends Component {
   state = EditorState.createEmpty();

  onChangeState = state => {
    this.setState(() => state);
  };
   render() {
     return <RichEditor editorState={this.state} onChange={this.onChangeState}/>;
   }
}
