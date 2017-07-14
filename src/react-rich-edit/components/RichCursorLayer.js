/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from "react";
import styles from './RichEditor.scss';
import {Timer} from "react-subscribe";
import RichCursor from "./RichCursor";
import SafeTextArea from "../models/SafeTextArea";

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
    const { dispatch } = this.props;
    dispatch('add-text', text);
  };
  onKeyDown = ev => {
    const parts = [];
    if (ev.ctrlKey) {
      parts.push('Ctrl');
    }
    if (ev.altKey) {
      parts.push('Alt');
    }
    if (ev.shiftKey) {
      parts.push('Shift');
    }
    if (ev.key !== 'Control' && ev.key !== 'Alt' && ev.key !== 'Shift') {
      parts.push(ev.key);
    }
    const keyName = parts.join('-');
    const { keyMap, dispatch } = this.props;
    if (keyMap.has(keyName)) {
      const action = keyMap.get(keyName);
      ev.preventDefault();
      ev.stopPropagation();
      dispatch(action);
    }
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
