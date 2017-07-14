/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from "react";
import styles from './RichEditor.scss';
import {Timer} from "react-subscribe";
import RichCursor from "./RichCursor";


function  AgentTextArea({onTextAreaRef, onFocus, onBlur, onChange}){
  return (
    <textarea
      ref={onTextAreaRef}
      className={styles.agentTextArea}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      value=""
    />
  );
}

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
        {i === 0 && AgentTextArea(this)}
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
  onChange = ev => {
    // This means user entered something.
    console.log(ev.target.value);
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
