import { FIELD_TYPE } from '@8base/utils';

import { validatorFacade as validator } from '../../src/validator';

import { VALIDATION_ERROR } from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockSwitchField = mockField(FIELD_TYPE.SWITCH);

describe('As developer, i can create switch field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const switchField = mockSwitchField({});
    switchField.isRequired = true;

    const validate = validator(switchField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const switchField = mockSwitchField({});
    switchField.isRequired = true;

    const validate = validator(switchField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const switchField = mockSwitchField({});
    switchField.isRequired = true;

    const validate = validator(switchField);

    expect(validate('switchValue')).toBeUndefined();
  });
});

