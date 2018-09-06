//@flow
import { FIELD_TYPE } from '@8base/utils';

import {
  validatorFacade as validator,
  type NumberField,
  type PreparedValidator,
} from '../../src/validator';

import {
  VALIDATION_ERROR,
} from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockNumberField = mockField(FIELD_TYPE.NUMBER);

describe('As developer, i can create number field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const numberField: NumberField = mockNumberField();
    numberField.isRequired = true;

    const validate: PreparedValidator = validator(numberField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const numberField: NumberField = mockNumberField();
    numberField.isRequired = true;

    const validate: PreparedValidator = validator(numberField);

    expect(validate('1')).toBeUndefined();
  });

  it('should check invalid value by number format and provide error message', () => {
    const numberField: NumberField = mockNumberField();
    const validate: PreparedValidator = validator(numberField);

    expect(validate('1a')).toBe(VALIDATION_ERROR.NOT_A_NUMBER());
  });

  it('should check empty value by number format and return undefined', () => {
    const numberField: NumberField = mockNumberField();
    const validate: PreparedValidator = validator(numberField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by number format and return undefined', () => {
    const numberField: NumberField = mockNumberField();
    const validate: PreparedValidator = validator(numberField);

    expect(validate('1.123')).toBeUndefined();
  });

  it(
    `should check invalid value by "precision" attribute
    and provide error message with allowed maximum precision`,
    () => {
      const precision = 1;
      const numberField: NumberField = mockNumberField({ precision });
      const validate: PreparedValidator = validator(numberField);

      expect(validate('1.234')).toBe(VALIDATION_ERROR.MAX_PRECISION(precision));
    },
  );

  it('should check empty value by "precision" attribute and return undefined', () => {
    const precision = 1;
    const numberField: NumberField = mockNumberField({ precision });
    const validate: PreparedValidator = validator(numberField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by "precision" attribute and return undefined', () => {
    const precision = 1;
    const numberField: NumberField = mockNumberField({ precision });
    const validate: PreparedValidator = validator(numberField);

    expect(validate('1.2')).toBeUndefined();
  });

  it(
    `should check invalid value by "minValue" attribute
    and provide error message with allowed minimum value`,
    () => {
      const minValue = 10;
      const numberField: NumberField = mockNumberField({ minValue });
      const validate: PreparedValidator = validator(numberField);

      expect(validate('9')).toBe(VALIDATION_ERROR.MIN_VALUE(minValue));
    },
  );

  it('should check empty value by "minValue" attribute and return undefined', () => {
    const minValue = 10;
    const numberField: NumberField = mockNumberField({ minValue });
    const validate: PreparedValidator = validator(numberField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by "minValue" attribute and return undefined', () => {
    const minValue = 10;
    const numberField: NumberField = mockNumberField({ minValue });
    const validate: PreparedValidator = validator(numberField);

    expect(validate('10')).toBeUndefined();
  });

  it(
    `should check invalid value by "maxValue" attribute
    and provide error message with allowed maximum value`,
    () => {
      const maxValue = 10;
      const numberField: NumberField = mockNumberField({ maxValue });
      const validate: PreparedValidator = validator(numberField);

      expect(validate('11')).toBe(VALIDATION_ERROR.MAX_VALUE(maxValue));
    },
  );

  it('should check empty value by "maxValue" attribute and return undefined', () => {
    const maxValue = 10;
    const numberField: NumberField = mockNumberField({ maxValue });
    const validate: PreparedValidator = validator(numberField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by "maxValue" attribute and return undefined', () => {
    const maxValue = 10;
    const numberField: NumberField = mockNumberField({ maxValue });
    const validate: PreparedValidator = validator(numberField);

    expect(validate('10')).toBeUndefined();
  });
});
