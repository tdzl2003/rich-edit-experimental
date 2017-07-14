/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from "react";
import RichEntity from "./RichEntity";

export default class RichBlock extends PureComponent {
  entityRefs = {};

  componentDidMount() {
    const { blockKey, blockRefs } = this.props;
    blockRefs[blockKey] = this;
  }
  componentWillUnmount() {
    const { blockKey, blockRefs } = this.props;
    delete blockRefs[blockKey];
  }

  onBlockRef = ref => {
    this.blockRef = ref;
  };

  renderEntity = ([key, value]) => {
    return (
      <RichEntity key={`b-${key}`} content={value} entityRefs={this.entityRefs} entityKey={key} />
    )
  };

  render() {
    const { content } = this.props;

    return (
      <p ref={this.onBlockRef}>
        {content.entrySeq().map(this.renderEntity)}
        <br />
      </p>
    )
  }
}
