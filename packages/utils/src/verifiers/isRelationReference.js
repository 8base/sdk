//@flow
import { isRelationField } from './isRelationField';
import type { FieldSchema } from '../types';

const isRelationReference = (fieldSchema: FieldSchema, data: any) => (
  isRelationField(fieldSchema)
  &&
  (typeof data === 'string' || data.length === 0 || typeof data[0] === 'string')
);

export { isRelationReference };
