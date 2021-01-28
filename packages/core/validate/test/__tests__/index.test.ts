import { SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';
import { validatorFacade } from '../../src/validator';

import { mockField } from '../utils';

describe("As a developer, i can't create unsupported field validator", () => {
  it('throws error', () => {
    expect(() => {
      validatorFacade((mockField as any)('UNSUPPORTED_FIELD')());
    }).toThrow(
      new SDKError(
        ERROR_CODES.UNSUPPORTED_FIELD_TYPE,
        PACKAGES.VALIDATE,
        "Validator doesn't support field type UNSUPPORTED_FIELD",
      ),
    );
  });
});
