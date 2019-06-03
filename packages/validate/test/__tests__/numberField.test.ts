//@flow
import { FIELD_TYPE } from '@8base/utils';

import { validatorFacade as validator } from '../../src/validator';

import { VALIDATION_ERROR } from '../../src/validator.constants';

import { mockField } from '../utils/';

const mockNumberField = mockField(FIELD_TYPE.NUMBER);

describe('As developer, i can create number field vaidator', () => {
  describe('isRequired', () => {
    it('should check invalid value and provide an error message', () => {
      const numberField = mockNumberField();
      numberField.isRequired = true;

      const validate = validator(numberField);

      expect(validate(null)).toBe(VALIDATION_ERROR.IS_REQUIRED());
    });

    it('should check valid value and return undefined', () => {
      const numberField = mockNumberField();
      numberField.isRequired = true;

      const validate = validator(numberField);

      expect(validate('1')).toBeUndefined();
    });
  });

  describe('number format', () => {
    it('should check invalid value and provide an error message', () => {
      const numberField = mockNumberField();
      const validate = validator(numberField);

      expect(validate('1a')).toBe(VALIDATION_ERROR.NOT_A_NUMBER());
    });

    it('should check empty value and return undefined', () => {
      const numberField = mockNumberField();
      const validate = validator(numberField);

      expect(validate('')).toBeUndefined();
    });

    it('should check null value and return undefined', () => {
      const numberField = mockNumberField();
      const validate = validator(numberField);

      expect(validate(null)).toBeUndefined();
    });

    it('should check undefined value and return undefined', () => {
      const numberField = mockNumberField();
      const validate = validator(numberField);

      expect(validate(undefined)).toBeUndefined();
    });

    it('should check valid value and return undefined', () => {
      const numberField = mockNumberField();
      const validate = validator(numberField);

      expect(validate('1.123')).toBeUndefined();
    });

    it('should check valid value in scientific form and return undefined', () => {
      const numberField = mockNumberField();
      const validate = validator(numberField);

      expect(validate('1.123e+4')).toBeUndefined();
    });
  });

  describe('precision', () => {
    it(
      'should check invalid value and provide an error message with maximum precision. Precision = 0',
      () => {
        const precision = 0;
        const numberField = mockNumberField({ precision });
        const validate = validator(numberField);

        expect(validate('1.2')).toBe(VALIDATION_ERROR.MAX_PRECISION(precision));
      },
    );

    it(
      'should check invalid value and provide an error message with maximum precision. Precision = 1',
      () => {
        const precision = 1;
        const numberField = mockNumberField({ precision });
        const validate = validator(numberField);

        expect(validate('1.234')).toBe(VALIDATION_ERROR.MAX_PRECISION(precision));
      },
    );

    it('should check empty value and return undefined', () => {
      const precision = 1;
      const numberField = mockNumberField({ precision });
      const validate = validator(numberField);

      expect(validate('')).toBeUndefined();
    });

    it('should check valid value and return undefined', () => {
      const precision = 1;
      const numberField = mockNumberField({ precision });
      const validate = validator(numberField);

      expect(validate('1.2')).toBeUndefined();
    });

    it(
      'should check invalid number in scientific form and provide an error messesage with maximum precision',
      () => {
        const precision = 1;
        const numberField = mockNumberField({ precision });
        const validate = validator(numberField);

        expect(validate('1.234e+1')).toBe(VALIDATION_ERROR.MAX_PRECISION(precision));
      },
    );

    it('should check valid number in scientific form and return undefined', () => {
      const precision = 1;
      const numberField = mockNumberField({ precision });
      const validate = validator(numberField);

      expect(validate('1.234e+2')).toBeUndefined();
    });
  });

  describe('minValue', () => {
    describe('Int', () => {
      it(
        'should check invalid value by default minValue and provide an error message with allowed minimum value',
        () => {
          const minValue = -2147483648;
          const numberField = mockNumberField();
          const validate = validator(numberField);

          expect(validate('-2147483650')).toBe(VALIDATION_ERROR.MIN_VALUE(minValue));
        },
      );

      it(
        'should check invalid value and provide an error message with allowed minimum value',
        () => {
          const minValue = 10;
          const numberField = mockNumberField({ minValue });
          const validate = validator(numberField);

          expect(validate('9')).toBe(VALIDATION_ERROR.MIN_VALUE(minValue));
        },
      );

      it('should check empty value and return undefined', () => {
        const minValue = 10;
        const numberField = mockNumberField({ minValue });
        const validate = validator(numberField);

        expect(validate('')).toBeUndefined();
      });

      it('should check valid value and return undefined', () => {
        const minValue = 10;
        const numberField = mockNumberField({ minValue });
        const validate = validator(numberField);

        expect(validate('10')).toBeUndefined();
      });
    });

    describe('Float', () => {
      it(
        'should check invalid value by default minValue and provide an error message with allowed minimum value',
        () => {
          const minValue = -Number.MAX_VALUE;
          const precision = 1;
          const numberField = mockNumberField({ precision });
          const validate = validator(numberField);

          expect(validate('-1.7976931348623159e+308')).toBe(VALIDATION_ERROR.MIN_VALUE(minValue));
        },
      );

      it(
        'should check invalid value and provide an error message with allowed minimum value',
        () => {
          const minValue = 10.5;
          const precision = 2;
          const numberField = mockNumberField({ minValue, precision });
          const validate = validator(numberField);

          expect(validate('10.49')).toBe(VALIDATION_ERROR.MIN_VALUE(minValue));
        },
      );

      it('should check empty value and return undefined', () => {
        const minValue = 10.5;
        const precision = 1;
        const numberField = mockNumberField({ minValue, precision });
        const validate = validator(numberField);

        expect(validate('')).toBeUndefined();
      });

      it('should check valid value and return undefined', () => {
        const minValue = 10.5;
        const precision = 2;
        const numberField = mockNumberField({ minValue, precision });
        const validate = validator(numberField);

        expect(validate('10.50')).toBeUndefined();
      });
    });

    describe('BigInt', () => {
      it('shouldn\'t check minValue', () => {
        const minValue = 10;
        const numberField = mockNumberField({ minValue, isBigInt: true });
        const validate = validator(numberField);

        expect(validate('5')).toBeUndefined();
      });
    });
  });

  describe('maxValue', () => {
    describe('Int', () => {
      it(
        'should check invalid value by default maxValue and provide an error message with allowed maximum value',
        () => {
          const maxValue = 2147483647;
          const numberField = mockNumberField();
          const validate = validator(numberField);

          expect(validate('2147483648')).toBe(VALIDATION_ERROR.MAX_VALUE(maxValue));
        },
      );

      it(
        'should check invalid value and provide an error message with allowed maximum value',
        () => {
          const maxValue = 10;
          const numberField = mockNumberField({ maxValue });
          const validate = validator(numberField);

          expect(validate('11')).toBe(VALIDATION_ERROR.MAX_VALUE(maxValue));
        },
      );

      it('should check empty value and return undefined', () => {
        const maxValue = 10;
        const numberField = mockNumberField({ maxValue });
        const validate = validator(numberField);

        expect(validate('')).toBeUndefined();
      });

      it('should check valid value and return undefined', () => {
        const maxValue = 10;
        const numberField = mockNumberField({ maxValue });
        const validate = validator(numberField);

        expect(validate('10')).toBeUndefined();
      });
    });

    describe('Float', () => {
      it(
        'should check invalid value by default maxValue and provide an error message with allowed maximum value',
        () => {
          const maxValue = Number.MAX_VALUE;
          const precision = 1;
          const numberField = mockNumberField({ precision });
          const validate = validator(numberField);

          expect(validate('1.7976931348623159e+308')).toBe(VALIDATION_ERROR.MAX_VALUE(maxValue));
        },
      );

      it(
        'should check invalid value and provide an error message with allowed maximum value',
        () => {
          const maxValue = 10.5;
          const precision = 2;
          const numberField = mockNumberField({ maxValue, precision });
          const validate = validator(numberField);

          expect(validate('10.51')).toBe(VALIDATION_ERROR.MAX_VALUE(maxValue));
        },
      );

      it('should check empty value and return undefined', () => {
        const maxValue = 10.5;
        const precision = 1;
        const numberField = mockNumberField({ maxValue, precision });
        const validate = validator(numberField);

        expect(validate('')).toBeUndefined();
      });

      it('should check valid value and return undefined', () => {
        const maxValue = 10.5;
        const precision = 2;
        const numberField = mockNumberField({ maxValue, precision });
        const validate = validator(numberField);

        expect(validate('10.49')).toBeUndefined();
      });
    });

    describe('BigInt', () => {
      it('shouldn\'t check maxValue', () => {
        const maxValue = 10;
        const numberField = mockNumberField({ maxValue, isBigInt: true });
        const validate = validator(numberField);

        expect(validate('20')).toBeUndefined();
      });
    });
  });
});

