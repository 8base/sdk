import { FIELD_TYPE } from '@8base/utils';

import { validatorFacade as validator } from '../../src/validator';

import { VALIDATION_ERROR } from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockJSONField = mockField(FIELD_TYPE.JSON);

describe('As developer, i can create JSON field vaidator', () => {
  it('should check invalid JSON value and provide error message', () => {
    const JSONField = mockJSONField({});

    const validate = validator(JSONField);

    expect(validate('{ "key": }')).toBe(
      VALIDATION_ERROR.NOT_A_JSON('Unexpected token } in JSON at position 9'),
    );
  });

  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const JSONField = mockJSONField({});
    JSONField.isRequired = true;

    const validate = validator(JSONField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const JSONField = mockJSONField({});
    JSONField.isRequired = true;

    const validate = validator(JSONField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const JSONField = mockJSONField({});
    JSONField.isRequired = true;

    const validate = validator(JSONField);

    expect(validate('{ "key": "value" }')).toBeUndefined();
  });
});

