//@flow

import { type FieldType } from '@8base/utils';
import { type Field } from '../../src/validator';

export const mockField = (fieldType: FieldType) => <T>(fieldTypeAttributes: T): Field<T> => ({
  fieldType,
  isRequired: false,
  fieldTypeAttributes,
});
