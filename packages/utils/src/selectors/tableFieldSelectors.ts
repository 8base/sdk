import * as R from 'ramda';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import { FIELD_TYPE } from '../constants';
import { FieldSchema, Format } from '../types';

export const getTableField = (tableField: FieldSchema) => tableField;

export const getFieldType: any = createSelector(
  getTableField,
  R.prop('fieldType'),
);

export const getFieldTypesAttributes = createSelector(
  getTableField,
  R.prop('fieldTypeAttributes'),
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

export const getFieldName = createSelector(
  getTableField,
  R.prop('name'),
);

export const getRelationTableId: ParametricSelector<FieldSchema, void, string> = createSelector(
  getTableField,
  R.path<any>(['relation', 'refTable', 'id']),
);

export const getRelationTableName: ParametricSelector<FieldSchema, void, string> = createSelector(
  getTableField,
  R.path<any>(['relation', 'refTable', 'name']),
);
