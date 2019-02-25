import * as R from 'ramda';
import { createSelector, type Selector } from 'reselect';
import { FIELD_TYPE, SMART_FORMATS } from '../constants';
import type { TableSchema, FieldSchema } from '../types';

export const getTable = (table?: TableSchema) => table;

export const getFieldById: Selector<TableSchema, string, $Shape<FieldSchema>> =
  ({ fields } : TableSchema, fieldId: string) =>
    R.find(
      R.pipe(R.prop('id'), R.equals(fieldId)),
      fields,
    ) || {};

export const getFieldTypeById = createSelector(
  getFieldById,
  R.prop('fieldType'),
);


export const isRelationField = createSelector(
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
  R.prop('name'),
);

export const hasNonMetaFields = R.pipe(
  R.propOr([], 'fields'),
  // $FlowIgnore
  R.any(R.propEq('isMeta', false)),
);

export const hasListFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ isList }) => isList),
);

export const hasRelationFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.RELATION),
);

export const hasFileFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.FILE),
);

export const hasDateFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.DATE),
);

export const hasSwitchFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.SWITCH),
);

export const hasScalarFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.TEXT || fieldType === FIELD_TYPE.NUMBER),
);

export const hasSmartFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldType }) => fieldType === FIELD_TYPE.SMART),
);

export const hasAddressFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldTypeAttributes = {}}) => fieldTypeAttributes && fieldTypeAttributes.format === SMART_FORMATS.ADDRESS),
);

export const hasPhoneFields = R.pipe(
  getTable,
  ({ fields }) => !!fields.find(({ fieldTypeAttributes = {}}) => fieldTypeAttributes && fieldTypeAttributes.format === SMART_FORMATS.PHONE),
);
