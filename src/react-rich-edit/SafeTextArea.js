/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from 'react';

// Safari 3.0+ "[object HTMLElementConstructor]"
const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
  || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification)

// if now is in composition session
let isOnComposition = false

// for safari use only, innervalue can't setState when compositionend occurred
let isInnerChangeFromOnChange = false;

export default class SafeTextArea extends PureComponent {
  state = {
    inputValue: '',
  };
  handleChange = (e) => {
    if (isInnerChangeFromOnChange) {
      isInnerChangeFromOnChange = false;
      return;
    }
    if (!isOnComposition) {
      const { onTextInput } = this.props;
      onTextInput(e.target.value);
      // this.setState({ inputValue: '' })
    } else {
      // Keep composition value.
      this.setState({ inputValue: e.target.value })
    }
  };
  handleKeyDown = (e) => {
    if (!isOnComposition) {
      const { onKeyDown } = this.props;
      onKeyDown(e);
    }
  }
  handleComposition = (e) => {
    // console.log('type ', e.type, ', target ', e.target, ',target.value ', e.target.value, ', data', e.data)

    // Flow check
    const { onTextInput } = this.props;
    if (!(e.target instanceof HTMLTextAreaElement)) return;

    if (e.type === 'compositionend') {
      // Safari think e.target.value in composition event is keyboard char,
      //  but it will fired another change after compositionend
      if (isSafari) {
        // do change in the next change event
        isInnerChangeFromOnChange = true
      }

      isOnComposition = false
      onTextInput(e.target.value);
      this.setState({ inputValue: '' })
    } else {
      isOnComposition = true
    }
  };
  render() {
    const { onTextAreaRef,onTextInput, ...others} = this.props;
    return (
      <textarea
        {...others}
        ref={onTextAreaRef}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onCompositionUpdate={this.handleComposition}
        onCompositionEnd={this.handleComposition}
        onCompositionStart={this.handleComposition}
        value={this.state.inputValue}
      />
    )
  }
}
