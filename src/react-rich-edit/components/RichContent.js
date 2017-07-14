/**
 * Created by DengYun on 2017/7/14.
 */

import React, { PureComponent } from 'react';
import RichBlock from "./RichBlock";

export default class RichContent extends PureComponent {
  blockRefs = {};

  renderBlock = ([key, value])=> {
    return (
      <RichBlock key={`ln-${key}`} content={value} blockRefs={this.blockRefs} blockKey={key} />
    );
  };
  componentDidMount() {
    const { postUpdate } = this.props;
    postUpdate && postUpdate();
  }
  componentDidUpdate() {
    const { postUpdate } = this.props;
    postUpdate && postUpdate();
  }
  queryPosition(key, offset) {
    const { blockMap } = this.props;

    const block = this.blockRefs[key];
    const blockData = blockMap.get(key);
    if (!block || !blockData) {
      return [-100, 0, 0];
    }
    if (offset === key) {
      // at line start.
      const first = blockData._list.first();

      if (first) {
        // There is a first element, use its size.
        const el = block.entityRefs[first[0]].entityRef;
        return [el.offsetLeft, el.offsetTop, el.offsetHeight];
      } else {
        // Empty line.
        return [blockRef]
      }
    } else {
      // after some element.
      const el = block.entityRefs[offset].entityRef;
      return [el.offsetLeft + el.offsetWidth, el.offsetTop, el.offsetHeight];
    }
  }
  render() {
    const { blockMap } = this.props;
    return (
      <div>
        {blockMap.entrySeq().map(this.renderBlock)}
      </div>
    );
  }
}
