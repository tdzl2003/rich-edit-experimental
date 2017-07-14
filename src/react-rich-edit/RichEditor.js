/**
 * Created by DengYun on 2017/7/14.
 */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './RichEditor.scss';
import RichContent from "./RichContent";

export default class RichEditor extends PureComponent {
  render() {
    const { editorState, style, className } = this.props;

    return (
      <div style={style} className={classnames(className, styles.richEditor)}>
        <RichContent contentState={editorState.getCurrentContent()}/>
      </div>
    );
  }
}
