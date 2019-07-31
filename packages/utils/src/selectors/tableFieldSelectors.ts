import * as R from 'ramda';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import { FIELD_TYPE } from '../constants';
import { FieldSchema } from '../types';

export const getTableField = (tableField: FieldSchema | void) => tableField;

export const getFieldType: any = createSelector(
  getTableField,
  R.propOr('', 'fieldType'),
);

export const getFieldTypesAttributes = createSelector(
  getTableField,
  R.propOr(null, 'fieldTypeAttributes'),
);

export const isRelationField = createSelector(
  getFieldType,
  R.equals(FIELD_TYPE.RELATION),
);

export const isFileField = createSelector(
  getFieldType,
  R.equals(FIELD_TYPE.FILE),
);

export const isSmartField = createSelector(
  getFieldType,
  R.equals(FIELD_TYPE.SMART),
);

export const isIdField = createSelector(
  getFieldType,
  R.equals(FIELD_TYPE.ID),
);

export const isMetaField = createSelector(
  getTableField,
  R.propEq('isMeta', true),
);

export const isListField = createSelector(
  getTableField,
  R.propEq('isList', true),
);

export const isSystemField = createSelector(
  getTableField,
  R.propEq('isSystem', true),
);

export const getFieldId = createSelector(
  getTableField,
  R.propOr('', 'id'),
);

export const getFieldName = createSelector(
  getTableField,
  fieldSchema => (fieldSchema ? fieldSchema.name : ''),
);

export const getFieldDisplayName = createSelector(
  getTableField,
  R.propOr('', 'displayName'),
);

export const getTableId = createSelector(
  getTableField,
  R.path<any>(['table', 'id']),
);

export const getTableName = createSelector(
  getTableField,
  R.path<any>(['table', 'name']),
);

export const getTableDisplayName = createSelector(
  getTableField,
  R.path<any>(['table', 'displayName']),
);

export const getRelationTableId: ParametricSelector<FieldSchema, void, string> = createSelector(
  getTableField,
  R.path<any>(['relation', 'refTable', 'id']),
);

export const getRelationTableName: ParametricSelector<FieldSchema, void, string> = createSelector(
  getTableField,
  R.path<any>(['relation', 'refTable', 'name']),
);

export const getRelationTableDisplayName: ParametricSelector<FieldSchema, void, string> = createSelector(
  getTableField,
  R.path<any>(['relation', 'refTable', 'displayName']),
);
