//@flow
import * as R from 'ramda';
import { isRelationField } from './isRelationField';
import type { FieldSchema } from '../types';

const isRelationInstance = (fieldSchema: FieldSchema, data: any) => (
  isRelationField(fieldSchema)
  &&
  !R.isNil(data)
  &&
  typeof data === 'object'
);

export { isRelationInstance };
