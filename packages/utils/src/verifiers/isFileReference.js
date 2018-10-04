//@flow
import * as R from 'ramda';

import { isFileField } from './isFileField';
import type { FieldSchema } from '../types';

const isFileReference = (fieldSchema: FieldSchema, data: any) => (
  isFileField(fieldSchema)
  &&
  !R.isNil(data)
  &&
  (typeof data === 'string' || data.length === 0 || typeof data[0] === 'string')
);

export { isFileReference };
