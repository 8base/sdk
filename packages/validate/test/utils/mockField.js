//@flow

import { type FieldType } from '@8base/utils';

export const mockField = (fieldType: FieldType) => <T>(fieldTypeAttributes: T): Field<T> => ({
  fieldType,
  isRequired: false,
  fieldTypeAttributes,
});
