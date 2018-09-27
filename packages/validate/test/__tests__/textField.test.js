//@flow
import { FIELD_TYPE, TEXT_FORMATS, type Format } from '@8base/utils';

import {
  validatorFacade as validator,
  type TextField,
  type PreparedValidator,
} from '../../src/validator';

import {
  VALIDATION_ERROR,
} from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockTextField = mockField(FIELD_TYPE.TEXT);

describe('As developer, i can create text field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const format: Format = TEXT_FORMATS.UNFORMATTED;
    const textField: TextField = mockTextField({ format });
    textField.isRequired = true;

    const validate: PreparedValidator = validator(textField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const format: Format = TEXT_FORMATS.UNFORMATTED;
    const textField: TextField = mockTextField({ format });
    textField.isRequired = true;

    const validate: PreparedValidator = validator(textField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const format: Format = TEXT_FORMATS.UNFORMATTED;
    const textField: TextField = mockTextField({ format });
    textField.isRequired = true;

    const validate: PreparedValidator = validator(textField);

    expect(validate('text')).toBeUndefined();
  });

  it(
    `should check invalid value by "fieldSize" attribute
    and provide error message with allowed fieldSize`,
    () => {
      const fieldSize = 5;
      const format: Format = TEXT_FORMATS.UNFORMATTED;
      const textField: TextField = mockTextField({ fieldSize, format });
      const validate: PreparedValidator = validator(textField);

      expect(validate('text text text')).toBe(VALIDATION_ERROR.MAX_FIELD_SIZE(fieldSize));
    },
  );

  it('should check empty value by "fieldSize" attribute and return undefined', () => {
    const fieldSize = 5;
    const format: Format = TEXT_FORMATS.UNFORMATTED;
    const textField: TextField = mockTextField({ fieldSize, format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by "fieldSize" attribute and return undefined', () => {
    const fieldSize = 5;
    const format = TEXT_FORMATS.UNFORMATTED;
    const textField: TextField = mockTextField({ fieldSize, format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('text')).toBeUndefined();
  });

  it('should check invalid value by email format and provide error message', () => {
    const format: Format = TEXT_FORMATS.EMAIL;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('test@.com')).toBe(VALIDATION_ERROR[format]());
  });

  it('should check empty value by email format and return undefined', () => {
    const format: Format = TEXT_FORMATS.EMAIL;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by email format and return undefined', () => {
    const format: Format = TEXT_FORMATS.EMAIL;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('test@test.com')).toBeUndefined();
  });

  it('should check invalid value by phone format and provide error message', () => {
    const format: Format = TEXT_FORMATS.PHONE;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('893293639734')).toBe(VALIDATION_ERROR[format]());
  });

  it('should check empty value by phone format and return undefined', () => {
    const format: Format = TEXT_FORMATS.PHONE;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by phone format and return undefined', () => {
    const format: Format = TEXT_FORMATS.PHONE;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('8932936397')).toBeUndefined();
  });

  it('should check invalid value by ssn format and provide error message', () => {
    const format: Format = TEXT_FORMATS.SSN;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('574-12-8165-12')).toBe(VALIDATION_ERROR[format]());
  });

  it('should check empty value by ssn format and return undefined', () => {
    const format: Format = TEXT_FORMATS.SSN;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by ssn format and return undefined', () => {
    const format: Format = TEXT_FORMATS.SSN;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('574-12-8165')).toBeUndefined();
  });

  it('should check invalid value by ein format and provide error message', () => {
    const format: Format = TEXT_FORMATS.EIN;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('23389067944')).toBe(VALIDATION_ERROR[format]());
  });

  it('should check empty value by ein format and return undefined', () => {
    const format: Format = TEXT_FORMATS.EIN;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by ein format and return undefined', () => {
    const format: Format = TEXT_FORMATS.EIN;
    const textField: TextField = mockTextField({ format });
    const validate: PreparedValidator = validator(textField);

    expect(validate('233890679')).toBeUndefined();
  });
});
