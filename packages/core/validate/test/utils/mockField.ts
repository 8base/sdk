import { FieldType } from '@8base/utils';
import { Field } from '../../src/validator';

export const mockField = (fieldType: FieldType) => (fieldTypeAttributes: {} = {}): Field => ({
  fieldType,
  fieldTypeAttributes,
  isRequired: false,
});
