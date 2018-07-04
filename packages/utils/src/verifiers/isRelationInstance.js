//@flow
import { isRelationField } from './isRelationField';
import type { FieldSchema } from '../types';

const isRelationInstance = (fieldSchema: FieldSchema, data: any) => (
  isRelationField(fieldSchema)
  &&
  typeof data === 'object'
);

export { isRelationInstance };
