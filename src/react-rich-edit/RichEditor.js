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
  render() {
    const { editorState, style, className } = this.props;

    const content = editorState.getCurrentContent();

    return (
      <div style={style} className={classnames(className, styles.richEditor)}>
        <RichContent ref={this.onContentRef} blockMap={content.getBlockMap()} postUpdate={this.postUpdate} />
        <RichCursorLayer
          queryPosition={this.state.queryPosition}
          selections={content.getSelectionList()}
        />
      </div>
    );
  }
}
