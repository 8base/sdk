import * as R from 'ramda';
import { createSelector, ParametricSelector } from 'reselect';
import { FIELD_TYPE, SMART_FORMATS } from '../constants';
import { TableSchema, FieldSchema } from '../types';

export const getTable = (table: TableSchema) => table || {};

export const getTableName = createSelector(
  getTable,
  R.prop('name'),
);

export const getTableDisplayName = createSelector(
  getTable,
  R.prop('displayName'),
);

export const getTableId = createSelector(
  getTable,
  R.prop('id'),
);

export const getFieldById: ParametricSelector<TableSchema, string, FieldSchema | void> = (
  { fields }: TableSchema,
  fieldId: string,
) =>
  R.find(
    R.pipe(
      R.prop('id'),
      R.equals(fieldId),
    ),
    fields,
  );

export const getFieldByName: ParametricSelector<TableSchema, string, FieldSchema | void> = (
  tableSchema: TableSchema,
  fieldName: string,
) => R.find(R.propEq('name', fieldName), tableSchema.fields);

const getFieldByIdOrEmpty: ParametricSelector<TableSchema, string, FieldSchema | {}> = createSelector(
  getFieldById,
  field => field || {},
);

export const getFieldTypeById: ParametricSelector<TableSchema, string, any> = createSelector(
  getFieldByIdOrEmpty,
  R.propOr('', 'fieldType'),
);

export const getTableApplication = createSelector(
  getTable,
  R.prop('application'),
);

export const getTableAppName = createSelector(
  getTableApplication,
  R.propOr(null, 'name'),
);

export const getTableAppDisplayName = createSelector(
  getTableApplication,
  R.propOr(null, 'displayName'),
);

export const isSystemTable = createSelector(
  getTable,
  R.propEq('isSystem', true),
);

export const isIntegrationTable = createSelector(
  getTable,
  ({ application }) => !!application,
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
  getFieldByIdOrEmpty,
  R.propEq('isMeta', true),
);

export const isListField = createSelector(
  getFieldByIdOrEmpty,
  R.propEq('isList', true),
);

export const getFieldNameById = createSelector(
  getFieldByIdOrEmpty,
  R.propOr('', 'name'),
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
  ({ fields }: TableSchema) =>
    !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.TEXT || fieldType === FIELD_TYPE.NUMBER),
);

export const hasSmartFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.SMART),
);

export const hasAddressFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) =>
    !!fields.find(
      ({ fieldTypeAttributes = {} }) => fieldTypeAttributes && fieldTypeAttributes.format === SMART_FORMATS.ADDRESS,
    ),
);

export const hasPhoneFields = R.pipe(
  getTable,
  ({ fields }: TableSchema) =>
    !!fields.find(
      ({ fieldTypeAttributes = {} }) => fieldTypeAttributes && fieldTypeAttributes.format === SMART_FORMATS.PHONE,
    ),
);

export const getSchemaFeatures = createSelector(
  getTable,
  R.prop('schemaFeatures'),
);

export const getDataFeatures = createSelector(
  getTable,
  R.prop('dataFeatures'),
);
