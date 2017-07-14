/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { Component } from "react";
import classnames from "classnames";
import { Record } from 'immutable';
import styles from './RichEditor.scss';

const Position = Record({
  left: 0,
  top: 0,
  height: 0,
});

// I'm not pure: re-render when CursorLayer renders.
export default class RichCursor extends Component {
  constructor(props) {
    super(props);
    const { queryPosition } = this.props;
    const { selection } = this.props;
    const [left, top, height] = queryPosition(selection.getFocusKey(), selection.getFocusOffset());
    this.state = {
      position: new Position({left, top, height}),
    };
  }

  componentWillReceiveProps({ queryPosition }) {
    if (queryPosition !== this.props.queryPosition) {
      const { selection } = this.props;
      const [left, top, height] = queryPosition(selection.getFocusKey(), selection.getFocusOffset());
      this.setState({
        position: this.state.position.merge({ left, top, height }),
      });
    }
  }

  render() {
    const { visible, focus, children } = this.props;
    const { position } = this.state;
    return (
      <div style={position.toJSON()} className={classnames(styles.cursor, focus && styles.focus, !visible && styles.invisible)}>
        {children}
      </div>
    );
  }
}

