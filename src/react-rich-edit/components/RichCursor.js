/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { Component } from "react";
import classnames from "classnames";
import styles from './RichEditor.scss';

// I'm not pure: re-render when CursorLayer renders.
export default class RichCursor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { queryPosition, selection, visible, focus, children } = this.props;

    const [left, top, height] = queryPosition(selection.getFocusKey(), selection.getFocusOffset());

    return (
      <div style={{left, top, height}} className={classnames(styles.cursor, focus && styles.focus, !visible && styles.invisible)}>
        {children}
      </div>
    );
  }
}

