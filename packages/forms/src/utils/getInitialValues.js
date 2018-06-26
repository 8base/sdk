// @flow
import * as R from 'ramda';

import type { TableSchema } from '../types';

const getInitialValues = (tableSchema: TableSchema): Object => R.reduce(
  (acc, { name, defaultValue }) => ({ ...acc, [name]: defaultValue }),
  {},
)(tableSchema.fields);

export { getInitialValues };
