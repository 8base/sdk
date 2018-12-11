//@flow

import * as R from 'ramda';
import { FIELD_TYPE, type FieldType, type Format } from '@8base/utils';
import { VALIDATION_ERROR, FORMAT_PATTERN } from './validator.constants';

type NumberFieldTypeAttributes = {
  precision?: number,
  minValue?: number,
  maxValue?: number,
};

type TextFieldTypeAttributes = {
  format: Format,
  fieldSize?: number,
};

type DateFieldTypeAttributes = {
  format: Format,
};

export type Field<T> = {
  isRequired: boolean,
  fieldType: FieldType,
  fieldTypeAttributes: T
};

export type NumberField = Field<NumberFieldTypeAttributes>;

export type TextField = Field<TextFieldTypeAttributes>;

export type DateField = Field<DateFieldTypeAttributes>;

export type SwitchField = Field<{}>;

export type FileField = Field<{}>;

export type RelationField = Field<{}>;

export type Fields = NumberField |
  TextField |
  DateField |
  SwitchField |
  FileField |
  RelationField;

const getFieldTypeAttributes: (Fields => {}) = R.prop('fieldTypeAttributes');
const getMaxPrecision: (NumberField => (number | void)) = R.pipe(getFieldTypeAttributes, R.propOr(undefined, 'precision'));
const getMinValue: (NumberField => (number | void)) = R.pipe(getFieldTypeAttributes, R.propOr(-2147483648, 'minValue'));
const getMaxValue: (NumberField => (number | void)) = R.pipe(getFieldTypeAttributes, R.propOr(2147483647, 'maxValue'));
const getMaxFieldSize: (TextField => (number | void)) = R.pipe(getFieldTypeAttributes, R.propOr(undefined, 'fieldSize'));
const getFormat: ((TextField | DateField) => (Format)) = R.pipe(getFieldTypeAttributes, R.prop('format'));

type ValidatorResult = string | void;
export type PreparedValidator = (?string) => ValidatorResult;
type Validator<T> = (T) => PreparedValidator;
type Check = (?string) => boolean;

const isEmpty: Check = R.either(R.isNil, R.isEmpty);

const checkRequired: PreparedValidator = R.ifElse(
  R.complement(isEmpty),
  R.always(undefined),
  R.always(VALIDATION_ERROR.IS_REQUIRED()),
);

const checkIsNumber: PreparedValidator = R.ifElse(
  R.pipe(
    R.cond([
      [R.isNil, R.always(0)],
      [R.T, Number],
    ]),
    R.complement(Number.isNaN),
  ),
  R.always(undefined),
  R.always(VALIDATION_ERROR.NOT_A_NUMBER()),
);

// TODO: replace ternary operator by R.ifElse
// when https://github.com/flowtype/flow-typed/issues/2411
// will be resolved.
const checkMaxPrecision: Validator<number> = (maxPrecision) => (value) => {
  if (isEmpty(value)) {
    return undefined;
  }

  return R.test(new RegExp(`^\\d*\\.?\\d{0,${maxPrecision}}$`), value || '') ?
    undefined :
    VALIDATION_ERROR.MAX_PRECISION(maxPrecision);
};

const checkMinValue: Validator<number> = (minValue) => R.ifElse(
  R.cond([
    [isEmpty, R.T],
    [R.T, R.pipe(Number, R.lte(minValue))],
  ]),
  R.always(undefined),
  R.always(VALIDATION_ERROR.MIN_VALUE(minValue)),
);

const checkMaxValue: Validator<number> = (maxValue) => R.ifElse(
  R.cond([
    [isEmpty, R.T],
    [R.T, R.pipe(Number, R.gte(maxValue))],
  ]),
  R.always(undefined),
  R.always(VALIDATION_ERROR.MAX_VALUE(maxValue)),
);

const checkMaxFieldSize: Validator<number> = (maxFieldSize) => R.ifElse(
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
const checkFormat: Validator<Format> = (format) => (value) => {
  if (isEmpty(value)) {
    return undefined;
  }

  return R.test(FORMAT_PATTERN[format], value || '') ?
    undefined :
    VALIDATION_ERROR[format]();
};

type ValidatorsGetter<T> = (field: T) => Array<PreparedValidator>;

const getCommonValidators: ValidatorsGetter<Fields> = (field) => {
  const validators = [];

  if (field.isRequired) {
    validators.push(
      checkRequired,
    );
  }

  return validators;
};

const getNumberFieldValidators: ValidatorsGetter<NumberField> = (field) => {
  const validators = [
    checkIsNumber,
  ];

  const maxPrecision = getMaxPrecision(field);
  const minValue = getMinValue(field);
  const maxValue = getMaxValue(field);

  if (maxPrecision) {
    validators.push(checkMaxPrecision(maxPrecision));
  }

  if (minValue) {
    validators.push(checkMinValue(minValue));
  }

  if (maxValue) {
    validators.push(checkMaxValue(maxValue));
  }

  return validators;
};

const getTextFieldValidators: ValidatorsGetter<TextField> = (field) => {
  const validators = [];

  const maxFieldSize = getMaxFieldSize(field);
  const format = getFormat(field);

  if (maxFieldSize) {
    validators.push(checkMaxFieldSize(maxFieldSize));
  }

  if (format && FORMAT_PATTERN[format]) {
    validators.push(checkFormat(format));
  }

  return validators;
};

const getDateFieldValidators: ValidatorsGetter<DateField> = (field) => {
  const validators = [];

  const format = getFormat(field);

  if (format && FORMAT_PATTERN[format]) {
    validators.push(checkFormat(format));
  }

  return validators;
};

const getSwitchFieldValidators: ValidatorsGetter<SwitchField> = () => [];

const getFileFieldValidators: ValidatorsGetter<FileField> = () => [];

const getRelationFieldValidators: ValidatorsGetter<RelationField> = () => [];

type ValidatorsProcesser = (validators: Array<PreparedValidator>) => PreparedValidator;

const processValidators: ValidatorsProcesser = validators => R.converge(
  (...values: Array<ValidatorResult>) => R.find(R.is(String))(values),
  validators,
);

export type ValidatorFacade = (field: Fields) => PreparedValidator;

/**
 * ValidatorFacade creates validaton function based on field metadata
 * @param field - Field metadata
 * @returns - Validation function
 */
export const validatorFacade: ValidatorFacade = R.pipe(
  R.converge(
    R.concat,
    [
      getCommonValidators,
      R.cond([
        [R.propEq('fieldType', FIELD_TYPE.NUMBER), getNumberFieldValidators],
        [R.propEq('fieldType', FIELD_TYPE.TEXT), getTextFieldValidators],
        [R.propEq('fieldType', FIELD_TYPE.DATE), getDateFieldValidators],
        [R.propEq('fieldType', FIELD_TYPE.SWITCH), getSwitchFieldValidators],
        [R.propEq('fieldType', FIELD_TYPE.FILE), getFileFieldValidators],
        [R.propEq('fieldType', FIELD_TYPE.RELATION), getRelationFieldValidators],
        [R.T, () => { throw new Error('Unsupported field type'); }],
      ]),
    ],
  ),
  processValidators,
);
