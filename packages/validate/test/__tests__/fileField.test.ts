import { FIELD_TYPE } from '@8base/utils';

import { validatorFacade as validator } from '../../src/validator';

import { VALIDATION_ERROR } from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockFileField = mockField(FIELD_TYPE.FILE);

describe('As developer, i can create file field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const fileField = mockFileField({});
    fileField.isRequired = true;

    const validate = validator(fileField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const fileField = mockFileField({});
    fileField.isRequired = true;

    const validate = validator(fileField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const fileField = mockFileField({});
    fileField.isRequired = true;

    const validate = validator(fileField);

    expect(validate('fileValue')).toBeUndefined();
  });
});

