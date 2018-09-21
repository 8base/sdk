//@flow
import { isFileField } from './isFileField';
import type { FieldSchema } from '../types';

const isFileReference = (fieldSchema: FieldSchema, data: any) => (
  isFileField(fieldSchema)
  &&
  (typeof data === 'string' || data.length === 0 || typeof data[0] === 'string')
);

export { isFileReference };
