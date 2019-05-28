import * as R from 'ramda';
import { createSelector, ParametricSelector } from 'reselect';
import { FIELD_TYPE, SMART_FORMATS } from '../constants';
import { TableSchema, FieldSchema } from '../types';

export const getTable = (table: TableSchema) => table;

export const getFieldById: ParametricSelector<TableSchema, string, Partial<FieldSchema>> =
  ({ fields } : TableSchema, fieldId: string) =>
    R.find(
      R.pipe(R.prop('id'), R.equals(fieldId)),
      fields,
    ) || {};

export const getFieldByName: ParametricSelector<TableSchema, string, Partial<FieldSchema>> =
  (tableSchema: TableSchema, fieldName: string) => R.find(
    R.propEq('name', fieldName),
    tableSchema.fields,
  );

export const getFieldTypeById: ParametricSelector<TableSchema, string, any> = createSelector(
  getFieldById,
  ({ fieldType }: Partial<FieldSchema>) => fieldType,
);


export const isRelationField: ParametricSelector<TableSchema, string, boolean> = createSelector(
  getFieldTypeById,
  R.equals(FIELD_TYPE.RELATION),
);

export const isFileField = createSelector(
  getFieldTypeById,
  R.equals(FIELD_TYPE.FILE),
);

export const isSmartField = createSelector(
  getFieldTypeById,
  R.equals(FIELD_TYPE.SMART),
);

export const isMetaField = createSelector(
  getFieldById,
  R.propEq('isMeta', true),
);

export const isListField = createSelector(
  getFieldById,
  R.propEq('isList', true),
);

export const getFieldNameById = createSelector(
  getFieldById,
  ({ name }: Partial<FieldSchema>) => name || '',
);

export const hasNonMetaFields: (schema?: TableSchema) => boolean = R.pipe(
  R.propOr([], 'fields'),
  R.any(R.propEq('isMeta', false)),
);

export const hasListFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ isList }) => isList),
);

export const hasRelationFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.RELATION),
);

export const hasFileFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.FILE),
);

export const hasDateFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.DATE),
);

export const hasSwitchFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.SWITCH),
);

export const hasScalarFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.TEXT || fieldType === FIELD_TYPE.NUMBER),
);

export const hasSmartFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.SMART),
);

export const hasAddressFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldTypeAttributes = {}}) => fieldTypeAttributes && fieldTypeAttributes.format === SMART_FORMATS.ADDRESS),
);

export const hasPhoneFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldTypeAttributes = {}}) => fieldTypeAttributes && fieldTypeAttributes.format === SMART_FORMATS.PHONE),
);
