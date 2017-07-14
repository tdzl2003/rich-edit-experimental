/**
 * Created by DengYun on 2017/7/14.
 */

import React, { PureComponent } from 'react';

export default class RichContent extends PureComponent {
  renderBlock = ([key, value])=> {
    return (
      <p key={`ln-${key}`}>{value}<br /></p>
    );
  };
  render() {
    const { contentState: { blockMap } } = this.props;
    return (
      <div>
        {blockMap.entrySeq().map(this.renderBlock)}
      </div>
    );
  }
}
