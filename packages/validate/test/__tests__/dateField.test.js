//@flow
import { FIELD_TYPE, FORMAT, type Format } from '@8base/utils';

import {
  validatorFacade as validator,
  type DateField,
  type PreparedValidator,
} from '../../src/validator';

import {
  VALIDATION_ERROR,
} from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockDateField = mockField(FIELD_TYPE.DATE);

describe('As developer, i can create date field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const format: Format = FORMAT.DATE;
    const dateField: DateField = mockDateField({ format });
    dateField.isRequired = true;

    const validate: PreparedValidator = validator(dateField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const format: Format = FORMAT.DATE;
    const dateField: DateField = mockDateField({ format });
    dateField.isRequired = true;

    const validate: PreparedValidator = validator(dateField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const format: Format = FORMAT.DATE;
    const dateField: DateField = mockDateField({ format });
    dateField.isRequired = true;

    const validate: PreparedValidator = validator(dateField);

    expect(validate('2018-06-21')).toBeUndefined();
  });

  it('should check invalid value by date format and provide error message', () => {
    const format: Format = FORMAT.DATE;
    const dateField: DateField = mockDateField({ format });
    const validate: PreparedValidator = validator(dateField);

    expect(validate('2018-31-31')).toBe(VALIDATION_ERROR[format]());
  });

  it('should check empty value by date format and return undefined', () => {
    const format: Format = FORMAT.DATE;
    const dateField: DateField = mockDateField({ format });
    const validate: PreparedValidator = validator(dateField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by date format and return undefined', () => {
    const format: Format = FORMAT.DATE;
    const dateField: DateField = mockDateField({ format });
    const validate: PreparedValidator = validator(dateField);

    expect(validate('2018-06-21')).toBeUndefined();
  });

  it('should check invalid value by datetime format and provide error message', () => {
    const format: Format = FORMAT.DATETIME;
    const dateField: DateField = mockDateField({ format });
    const validate: PreparedValidator = validator(dateField);

    expect(validate('2018-06-06T21:00:80.00000Z')).toBe(VALIDATION_ERROR[format]());
  });

  it('should check empty value by datetime format and return undefined', () => {
    const format: Format = FORMAT.DATETIME;
    const dateField: DateField = mockDateField({ format });
    const validate: PreparedValidator = validator(dateField);

    expect(validate('')).toBeUndefined();
  });

  it('should check valid value by datetime format and return undefined', () => {
    const format: Format = FORMAT.DATETIME;
    const dateField: DateField = mockDateField({ format });
    const validate: PreparedValidator = validator(dateField);

    expect(validate('2018-06-06T21:00:00.000Z')).toBeUndefined();
  });
});
