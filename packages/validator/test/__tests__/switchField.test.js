//@flow

import {
  validatorFacade as validator,
  type SwitchField,
  type PreparedValidator,
} from '../../src/validator';

import {
  FIELD_TYPE,
  VALIDATION_ERROR,
} from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockSwitchField = mockField(FIELD_TYPE.SWITCH);

describe('As developer, i can create switch field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const switchField: SwitchField = mockSwitchField({});
    switchField.isRequired = true;

    const validate: PreparedValidator = validator(switchField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const switchField: SwitchField = mockSwitchField({});
    switchField.isRequired = true;

    const validate: PreparedValidator = validator(switchField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const switchField: SwitchField = mockSwitchField({});
    switchField.isRequired = true;

    const validate: PreparedValidator = validator(switchField);

    expect(validate('switchValue')).toBeUndefined();
  });
});
