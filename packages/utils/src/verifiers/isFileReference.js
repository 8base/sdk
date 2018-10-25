//@flow
import * as R from 'ramda';

import { isFileField } from './isFileField';
import type { FieldSchema } from '../types';

const isFileReference = (fieldSchema: FieldSchema, data: any) => (
  isFileField(fieldSchema)
  &&
  !R.isNil(data)
  &&
  (
    typeof data === 'string'
    ||
    (
      data && typeof data.id === 'string'
    )
    ||
    (
      Array.isArray(data)
      &&
      (
        data.length === 0
        ||
        isFileReference(fieldSchema, data[0])
      )
    )
  )
);

export { isFileReference };
