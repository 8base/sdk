// @flow
import * as R from 'ramda';

import type { FieldSchema } from '../types';

const isBigInt: (FieldSchema) => boolean = R.pathEq(
  ['fieldTypeAttributes', 'isBigInt'],
  true,
);

export { isBigInt };

