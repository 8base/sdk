//@flow
import { isFileField } from './isFileField';
import { isFileEntity } from './isFileEntity';
import type { FieldSchema } from '../types';

const isFileInstance = (fieldSchema: FieldSchema, data: any) => (
  isFileField(fieldSchema) &&
  (
    isFileEntity(fieldSchema, data)
    ||
    (data && typeof data.fileId === 'string')
    ||
    (Array.isArray(data) && isFileInstance(fieldSchema, data[0]))
  )
);

export { isFileInstance };
