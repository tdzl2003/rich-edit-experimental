/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from "react";
import styles from './RichEditor.scss';
import {Timer} from "react-subscribe";
import RichCursor from "./RichCursor";

export default class RichCursorLayer extends PureComponent {
  state = {
    visible: false,
  };
  onTimer = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  renderCursor = (data, i) => {
    const { queryPosition } = this.props;
    const { visible } = this.state;
    return (
      <RichCursor
        queryPosition={queryPosition}
        key={i}
        selection={data}
        visible={visible}
      />
    )
  }
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
