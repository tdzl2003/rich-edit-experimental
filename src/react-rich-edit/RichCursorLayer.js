/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from "react";
import styles from './RichEditor.scss';
import {Timer} from "react-subscribe";
import RichCursor from "./RichCursor";
import SafeTextArea from "./SafeTextArea";

export default class RichCursorLayer extends PureComponent {
  state = {
    visible: false,
    focus: false,
  };
  onTimer = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  renderAgenttTextArea(){
    // TODO: Display composition state if possible.
    return (
      <SafeTextArea
        onTextAreaRef={this.onTextAreaRef}
        className={styles.agentTextArea}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onTextInput={this.onTextInput}
        onKeyDown={this.onKeyDown}
      />
    );
  }
  renderCursor = (data, i) => {
    const { queryPosition } = this.props;
    const { visible, focus } = this.state;
    return (
      <RichCursor
        queryPosition={queryPosition}
        key={i}
        selection={data}
        visible={visible}
        focus={focus}
        onTextAreaRef={this.onTextAreaRef}
      >
        {i === 0 && this.renderAgenttTextArea()}
      </RichCursor>
    )
  };
  focus() {
    this.textArea.focus();
  }
  onTextAreaRef = ref => {
    this.textArea = ref;
  };
  onFocus = () => {
    this.setState({
      focus: true,
    });
  };
  onBlur = () => {
    this.setState({
      focus: false,
    });
  };
  onTextInput = text => {
    // This means user entered something.
    console.log(text);
  };
  onKeyDown = ev => {
    console.log(ev.nativeEvent);
  };

  render() {
    const { selections } = this.props;

    return (
      <div className={styles.cursorLayer}>
        <Timer interval={600} onTimer={this.onTimer} />
        {selections.map(this.renderCursor)}
      </div>
    )
  }
}
