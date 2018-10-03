//@flow
import * as R from 'ramda';
import { isRelationField } from './isRelationField';
import type { FieldSchema } from '../types';

const isRelationReference = (fieldSchema: FieldSchema, data: any) => (
  isRelationField(fieldSchema)
  &&
  (
    R.isNil(data)
    ||
    typeof data === 'string'
    ||
    (
      Array.isArray(data)
      &&
      (data.length === 0 || typeof data[0] === 'string')
    )
  )
);

export { isRelationReference };
