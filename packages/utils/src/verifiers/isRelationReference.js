//@flow
import { isRelationField } from './isRelationField';
import type { FieldSchema } from '../types';

const isRelationReference = (fieldSchema: FieldSchema, data: any) => (
  isRelationField(fieldSchema)
  &&
  (
    typeof data === 'string'
    ||
    data && typeof data.id === 'string'
    ||
    (
      Array.isArray(data)
      &&
      (data.length === 0 || isRelationReference(fieldSchema, data[0]))
    )
  )
);

export { isRelationReference };
