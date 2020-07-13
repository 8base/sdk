import * as R from 'ramda';
import { SDKError, ERROR_CODES, PACKAGES, FIELD_TYPE, FieldType, Format } from '@8base/utils';
import { Decimal } from 'decimal.js';

import { VALIDATION_ERROR, FORMAT_PATTERN } from './validator.constants';

export type Field = {
  isRequired: boolean;
  fieldType: FieldType;
  fieldTypeAttributes: Partial<{
    minValue: number;
    maxValue: number;
    precision: number;
    isBigInt: boolean;
    fieldSize: number;
    format: Format;
  }>;
};

const INT_MAX_VALUE = Math.pow(2, 31) - 1;
const INT_MIN_VALUE = -Math.pow(2, 31);
const FLOAT_MAX_VALUE = Number.MAX_VALUE;
const FLOAT_MIN_VALUE = -Number.MAX_VALUE;

const getFieldTypeAttributes: (obj: Field) => Record<any, any> = R.prop('fieldTypeAttributes');
const getMinValueFromAttributes: (obj: Field) => number = R.pipe(
  getFieldTypeAttributes,
  R.prop('minValue'),
);
const getMaxValueFromAttributes: (obj: Field) => number = R.pipe(
  getFieldTypeAttributes,
  R.prop('maxValue'),
);
const getMaxPrecisionFromAttributes: (obj: Field) => number = R.pipe(
  getFieldTypeAttributes,
  R.prop('precision'),
);
const isBigIntFromAttributes: (obj: Field) => boolean = R.pipe(
  getFieldTypeAttributes,
  R.prop('isBigInt'),
);
const getMaxFieldSizeFromAttributes: (obj: Field) => number = R.pipe(
  getFieldTypeAttributes,
  R.prop('fieldSize'),
);
const getFormatFromAttributes: (obj: Field) => Format = R.pipe(
  getFieldTypeAttributes,
  R.prop('format'),
);

const getMinValue = (field: Field): number => {
  const minValue = getMinValueFromAttributes(field);
  const precision = getMaxPrecisionFromAttributes(field);

  if (typeof minValue === 'number') {
    return minValue;
  } else if (typeof precision === 'number' && precision !== 0) {
    return FLOAT_MIN_VALUE;
  }

  return INT_MIN_VALUE;
};

const getMaxValue = (field: Field): number => {
  const maxValue = getMaxValueFromAttributes(field);
  const precision = getMaxPrecisionFromAttributes(field);

  if (typeof maxValue === 'number') {
    return maxValue;
  } else if (typeof precision === 'number' && precision !== 0) {
    return FLOAT_MAX_VALUE;
  }

  return INT_MAX_VALUE;
};

type ValidatorResult = string | void;
export type PreparedValidator = (arg: string | null | void) => ValidatorResult;
type Validator<T> = (arg: T) => PreparedValidator;
type Check = (arg: string | null) => boolean;

const isEmpty: Check = R.either(R.isNil, R.isEmpty);

const checkRequired: PreparedValidator = R.ifElse(
  R.complement(isEmpty),
  R.always(undefined),
  R.always(VALIDATION_ERROR.IS_REQUIRED()),
);

const checkIsNumber: PreparedValidator = R.ifElse(
  R.pipe(
    R.cond([[R.isNil, R.always(0)], [R.T, Number]]),
    R.complement(Number.isNaN),
  ),
  R.always(undefined),
  R.always(VALIDATION_ERROR.NOT_A_NUMBER()),
);

const checkIsJson: PreparedValidator = value => {
  if (typeof value === 'string' && value.length > 0) {
    try {
      JSON.parse(value);

      return undefined;
    } catch (e) {
      return VALIDATION_ERROR.NOT_A_JSON(e.message);
    }
  }
};

// TODO: replace ternary operator by R.ifElse
// when https://github.com/flowtype/flow-typed/issues/2411
// will be resolved.
const checkMaxPrecision: Validator<number> = maxPrecision => (value: any) => {
  if (isEmpty(value)) {
    return undefined;
  }

  Decimal.set({ defaults: true });

  const decimalValue = new Decimal(value);
  const precision = decimalValue.decimalPlaces();

  return precision <= maxPrecision ? undefined : VALIDATION_ERROR.MAX_PRECISION(maxPrecision);
};

const checkMinValue: Validator<number> = minValue =>
  R.ifElse(
    R.cond<string | null, boolean>([
      [isEmpty, R.T],
      [
        R.T,
        R.pipe(
          Number,
          R.lte(minValue),
        ),
      ],
    ]),
    R.always(undefined),
    R.always(VALIDATION_ERROR.MIN_VALUE(minValue)),
  );

const checkMaxValue: Validator<number> = maxValue =>
  R.ifElse(
    R.cond<string | null, boolean>([
      [isEmpty, R.T],
      [
        R.T,
        R.pipe(
          Number,
          R.gte(maxValue),
        ),
      ],
    ]),
    R.always(undefined),
    R.always(VALIDATION_ERROR.MAX_VALUE(maxValue)),
  );

const checkMaxFieldSize: Validator<number> = maxFieldSize =>
  R.ifElse(
    R.pipe(
      R.propOr(0, 'length'),
      R.gte(maxFieldSize),
    ),
    R.always(undefined),
    R.always(VALIDATION_ERROR.MAX_FIELD_SIZE(maxFieldSize)),
  );

// TODO: replace ternary operator by R.ifElse
// when https://github.com/flowtype/flow-typed/issues/2411
// will be resolved.
const checkFormat: Validator<Format> = (format: Format) => (value: any) => {
  if (isEmpty(value)) {
    return undefined;
  }

  return R.test((FORMAT_PATTERN as any)[format], value || '') ? undefined : (VALIDATION_ERROR as any)[format]();
};

type ValidatorsGetter<T> = (field: T) => PreparedValidator[];

const getCommonValidators: ValidatorsGetter<Field> = field => {
  const validators = [];

  if (field.isRequired) {
    validators.push(checkRequired);
  }

  return validators;
};

const getNumberFieldValidators: ValidatorsGetter<Field> = field => {
  const validators = [checkIsNumber];

  const maxPrecision = getMaxPrecisionFromAttributes(field);
  const minValue = getMinValue(field);
  const maxValue = getMaxValue(field);
  const isBigInt = isBigIntFromAttributes(field);

  if (maxPrecision || maxPrecision === 0) {
    validators.push(checkMaxPrecision(maxPrecision));
  }

  if (minValue && !isBigInt) {
    validators.push(checkMinValue(minValue));
  }

  if (maxValue && !isBigInt) {
    validators.push(checkMaxValue(maxValue));
  }

  return validators;
};

const getTextFieldValidators: ValidatorsGetter<Field> = field => {
  const validators = [];

  const maxFieldSize = getMaxFieldSizeFromAttributes(field);
  const format = getFormatFromAttributes(field);

  if (maxFieldSize) {
    validators.push(checkMaxFieldSize(maxFieldSize));
  }

  if (format && FORMAT_PATTERN[format]) {
    validators.push(checkFormat(format));
  }

  return validators;
};

const getDateFieldValidators: ValidatorsGetter<Field> = field => {
  const validators = [];

  const format = getFormatFromAttributes(field);

  if (format && FORMAT_PATTERN[format]) {
    validators.push(checkFormat(format));
  }

  return validators;
};

const getSwitchFieldValidators: ValidatorsGetter<Field> = () => [];

const getFileFieldValidators: ValidatorsGetter<Field> = () => [];

const getRelationFieldValidators: ValidatorsGetter<Field> = () => [];

const getSmartFieldValidators: ValidatorsGetter<Field> = () => [];

const getJSONFieldValidators: ValidatorsGetter<Field> = () => [checkIsJson];

type ValidatorsProcesser = (validators: PreparedValidator[]) => PreparedValidator;

const processValidators: ValidatorsProcesser = validators =>
  R.converge((...values: ValidatorResult[]) => R.find(R.is(String))(values), validators);

export type ValidatorFacade = (field: Field) => PreparedValidator;

/**
 * ValidatorFacade creates validaton function based on field metadata
 * @param field - Field metadata
 * @returns - Validation function
 */
export const validatorFacade: ValidatorFacade = R.pipe(
  R.converge(R.concat, [
    getCommonValidators,
    R.cond([
      [R.propEq('fieldType', FIELD_TYPE.NUMBER), getNumberFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.TEXT), getTextFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.DATE), getDateFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.SWITCH), getSwitchFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.FILE), getFileFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.RELATION), getRelationFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.SMART), getSmartFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.JSON), getJSONFieldValidators],
      [R.propEq('fieldType', FIELD_TYPE.GEO), () => [() => undefined]],
      [
        R.T,
        field => {
          throw new SDKError(
            ERROR_CODES.UNSUPPORTED_FIELD_TYPE,
            PACKAGES.VALIDATE,
            `Validator doesn't support field type ${field.fieldType}`,
          );
        },
      ],
    ]),
  ]),
  processValidators,
);
