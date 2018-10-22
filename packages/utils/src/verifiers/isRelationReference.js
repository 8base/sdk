//@flow
import { isRelationField } from './isRelationField';
import type { FieldSchema } from '../types';

const isRelationReference = (fieldSchema: FieldSchema, data: any) => (
  isRelationField(fieldSchema)
  &&
  (
    typeof data === 'string'
    ||
    (
      Array.isArray(data)
      &&
      (data.length === 0 || typeof data[0] === 'string')
    )
    ||
    (
      Array.isArray(data)
      &&
      (data.length === 0 || typeof data[0].id === 'string')
    )
  )
);

export { isRelationReference };
