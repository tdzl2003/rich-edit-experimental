/**
 * Created by DengYun on 2017/7/14.
 */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './RichEditor.scss';
import RichContent from "./RichContent";
import RichCursorLayer from "./RichCursorLayer";

export default class RichEditor extends PureComponent {
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
        />
      </div>
    );
  }
}
