/**
 * Created by tdzl2003 on 2017/7/15.
 */

import { Map } from 'immutable';

import moveActions from './moveActions';

const defaultActionMap = Map({
  ...moveActions,
});

export default defaultActionMap;
