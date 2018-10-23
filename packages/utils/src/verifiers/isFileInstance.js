//@flow
import * as R from 'ramda';

import { isFileField } from './isFileField';
import type { FieldSchema } from '../types';

const isFileInstance = (fieldSchema: FieldSchema, data: any) => (
  isFileField(fieldSchema) &&
  (
    (data && typeof data.fileId === 'string')
    ||
    (Array.isArray(data) && isFileInstance(fieldSchema, data[0]))
    ||
    R.isNil(data)
  )
);

export { isFileInstance };
