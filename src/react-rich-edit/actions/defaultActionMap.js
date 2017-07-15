/**
 * Created by tdzl2003 on 2017/7/15.
 */

import { Map } from 'immutable';

import moveActions from './moveActions';
import editActions from './editActions';

const defaultActionMap = Map({
  ...moveActions,
  ...editActions,
});

export default defaultActionMap;
