import React, { Component } from 'react';

export default class NumberRenderer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  formatValue(value) {
    var val = Number(value);
    if (isNaN(value)) return <span style={{ color: 'red' }}>NaN</span>;
    return val;
  }

  // noinspection JSUnusedGlobalSymbols
  refresh(params) {
    if (params.value !== this.state.value) {
      this.setState({
        value: params.value,
      });
    }
    return true;
  }

  render() {
    return <span>{this.formatValue(this.state.value)}</span>;
  }
}