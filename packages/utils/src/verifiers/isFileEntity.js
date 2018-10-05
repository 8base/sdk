//@flow
import { isFileField } from './isFileField';
import type { FieldSchema } from '../types';

const isFileEntity = (fieldSchema: FieldSchema, data: any) => (
  isFileField(fieldSchema)
  &&
  (
    data instanceof File ||
    (Array.isArray(data) && data[0] instanceof File)
  )
);

export { isFileEntity };
