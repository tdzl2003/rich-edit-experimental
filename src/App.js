/**
 * Created by DengYun on 2017/7/14.
 */
import React, { Component } from 'react';
import { RichEditor, EditorState } from 'react-rich-edit';

export default class App extends Component {
   state = {
     editorState: EditorState.createWithText('Hello, Rich Editor.'),
   };

  onChangeState = editorState => {
    this.setState({editorState});
  };
   render() {
     return <RichEditor editorState={this.state.editorState} onChange={this.onChangeState}/>;
   }
}
