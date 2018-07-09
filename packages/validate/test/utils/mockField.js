//@flow

import {
  type Field,
} from '../../src/validator';

import {
  type FieldType,
} from '../../src/validator.constants';

export const mockField = (fieldType: FieldType) => <T>(fieldTypeAttributes: T): Field<T> => ({
  fieldType,
  isRequired: false,
  fieldTypeAttributes,
});
