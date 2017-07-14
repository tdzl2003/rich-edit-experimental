/**
 * Created by DengYun on 2017/7/14.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const rootEl = document.getElementById('root');

function render() {
  if (__DEV__) {
    window.React = React;
  }
  ReactDOM.render((
    <App />
  ), rootEl);
}


if (document.readyState !== 'loading') {
  render();
} else {
  document.addEventListener('DOMContentLoaded', render);
}
