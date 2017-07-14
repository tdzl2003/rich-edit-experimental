/**
 * Created by tdzl2003 on 2017/7/14.
 */

import React, { PureComponent } from "react";

export default class RichEntity extends PureComponent {
  componentDidMount() {
    const { entityKey, entityRefs } = this.props;
    entityRefs[entityKey] = this;
  }
  componentWillUnmount() {
    const { entityKey, entityRefs } = this.props;
    delete entityRefs[entityKey];
  }

  onEntityRef = ref => {
    this.entityRef = ref;
  };

  render() {
    const { content } = this.props;

    return React.cloneElement(content.renderJSX(), {
      ref: this.onEntityRef,
    });
  }
}
