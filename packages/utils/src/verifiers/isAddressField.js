//@flow
import * as R from 'ramda';

import { FIELD_TYPE } from '../constants';
import type { FieldSchema } from '../types';

const isAddressField: (FieldSchema) => boolean = R.allPass([
  R.propEq('fieldType', FIELD_TYPE.SMART),
  R.pathEq(['fieldTypeAttributes', 'format'], 'ADDRESS'),
]);

export { isAddressField };
