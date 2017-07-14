/**
 * Created by DengYun on 2017/7/14.
 */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './RichEditor.scss';
import RichContent from "./RichContent";
import RichCursorLayer from "./RichCursorLayer";
import defaultKeyMap from "../models/defaultKeyMap";
import defaultActionMap from "../actions/defaultActionMap";

export default class RichEditor extends PureComponent {
  static defaultProps = {
    keyMap: defaultKeyMap,
    actionMap: defaultActionMap,
  };
  state = {
    queryPosition: (key, offset) => [0, 0, 0],
  };
  postUpdate = () => {
    if (this.contentLayer) {
      // make queryPosition changes each time content changes.
      this.setState({
        queryPosition: this.contentLayer.queryPosition.bind(this.contentLayer),
      });
    }
  };
  componentDidMount() {
    this.postUpdate();
  }
  onContentRef = ref => {
    this.contentLayer = ref;
  };
  onCursorLayerRef = ref => {
    this.cursorLayer = ref;
  };
  onMouseDown = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    this.cursorLayer.focus();
  };
  onMouseUp = ev => {
    ev.stopPropagation();
    ev.preventDefault();
  };
  onMouseMove = ev => {
    ev.stopPropagation();
    ev.preventDefault();
  };
  onClick = ev => {
    ev.stopPropagation();
    ev.preventDefault();
  };
  dispatch = (action, ...payload) => {
    const { editorState, actionMap, onChange } = this.props;
    if (!actionMap.has(action)) {
      console.warn(`Action ${action} was not implemented yet.`);
      return;
    }
    const func = actionMap.get(action);
    payload.unshift(editorState);
    onChange(func.apply(this, payload));
  };
  render() {
    const { editorState, style, className } = this.props;

    const content = editorState.getCurrentContent();

    return (
      <div
        style={style}
        className={classnames(className, styles.richEditor)}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
      >
        <RichContent
          ref={this.onContentRef} blockMap={content.getBlockMap()} postUpdate={this.postUpdate}
        />
        <RichCursorLayer
          ref={this.onCursorLayerRef}
          queryPosition={this.state.queryPosition}
          selections={content.getSelectionList()}
          keyMap={this.props.keyMap}
          dispatch={this.dispatch}
        />
      </div>
    );
  }
}
