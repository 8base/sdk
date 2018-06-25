//@flow

import {
  validatorFacade as validator,
  type FileField,
  type PreparedValidator,
} from '../../src/validator';

import {
  FIELD_TYPE,
  VALIDATION_ERROR,
} from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockFileField = mockField(FIELD_TYPE.FILE);

describe('As developer, i can create file field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const fileField: FileField = mockFileField({});
    fileField.isRequired = true;

    const validate: PreparedValidator = validator(fileField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const fileField: FileField = mockFileField({});
    fileField.isRequired = true;

    const validate: PreparedValidator = validator(fileField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const fileField: FileField = mockFileField({});
    fileField.isRequired = true;

    const validate: PreparedValidator = validator(fileField);

    expect(validate('fileValue')).toBeUndefined();
  });
});
