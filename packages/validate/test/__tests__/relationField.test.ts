import { FIELD_TYPE } from '@8base/utils';

import { validatorFacade as validator } from '../../src/validator';

import { VALIDATION_ERROR } from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockRelationField = mockField(FIELD_TYPE.RELATION);

describe('As developer, i can create relation field vaidator', () => {
  it('should check invalid value by "isRequired" attribute and provide error message', () => {
    const relationField = mockRelationField({});
    relationField.isRequired = true;

    const validate = validator(relationField);

    expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check empty value by "isRequired" attribute and provide error message', () => {
    const relationField = mockRelationField({});
    relationField.isRequired = true;

    const validate = validator(relationField);

    expect(validate('')).toBe(VALIDATION_ERROR.IS_REQUIRED());
  });

  it('should check valid value by "isRequired" attribute and return undefined', () => {
    const relationField = mockRelationField({});
    relationField.isRequired = true;

    const validate = validator(relationField);

    expect(validate('relationValue')).toBeUndefined();
  });
});
