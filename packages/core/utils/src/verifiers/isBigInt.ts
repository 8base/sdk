import * as R from 'ramda';

import { FieldSchema } from '../types';

const isBigInt: (fieldSchema: FieldSchema) => boolean = R.pathEq(['fieldTypeAttributes', 'isBigInt'], true);

export { isBigInt };
