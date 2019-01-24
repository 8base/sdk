//@flow

import { validatorFacade } from '../../src/validator';

import { mockField } from '../utils';

describe('As a developer, i can\'t create unsupported field validator', () => {
  it('throws error', () => {
    try {
      validatorFacade(mockField({ fieldType: 'UNSUPPORTED_FIELD' })());
    } catch (error) {
      expect(error.message).toBe('Unsupported field type');
    }
  });
});
