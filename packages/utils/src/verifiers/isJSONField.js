// @flow
import * as R from 'ramda';

import { FIELD_TYPE } from '../constants';
import type { FieldSchema } from '../types';

const isJSONField: (FieldSchema) => boolean = R.propEq(
  'fieldType',
  FIELD_TYPE.JSON,
);

export { isJSONField };

