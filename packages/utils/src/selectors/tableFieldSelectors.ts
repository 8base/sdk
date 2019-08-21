import * as R from 'ramda';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import * as tablesListSelectors from './tablesListSelectors';
import * as tableSelectors from './tableSelectors';
import { FIELD_TYPE, FIELD_KINDS } from '../constants';
import { FieldSchema, TableSchema, FieldKind } from '../types';

export const getTableField = (tableField: FieldSchema | void): FieldSchema => tableField as any;

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

export const isMissingRelationField = createSelector(
  getFieldType,
  R.equals(FIELD_TYPE.MISSING_RELATION),
);

export const isOneWayRelationField = createSelector(
  getFieldType,
  R.equals(FIELD_TYPE.ONE_WAY_RELATION),
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

export const getSchemaFeatures = createSelector(
  getTableField,
  R.prop('schemaFeatures'),
);

export const getDataFeatures = createSelector(
  getTableField,
  R.prop('dataFeatures'),
);

export const getFieldKind = createSelector(
  isSystemField,
  getRelationTableId,
  (_, tablesSchema: TableSchema[]): TableSchema[] => tablesSchema,
  (isSystem: boolean, relationTableId: string, tablesSchema: TableSchema[]) => {
    let kind = FIELD_KINDS.USER;

    if (isSystem) {
      kind = FIELD_KINDS.SYSTEM;
    } else if (relationTableId) {
      const refTable = tablesListSelectors.getTableById(tablesSchema, relationTableId);

      if (tableSelectors.isSystemTable(refTable)) {
        kind = FIELD_KINDS.SYSTEM;
      } else if (tableSelectors.isIntegrationTable(refTable)) {
        kind = FIELD_KINDS.EXTERNAL;
      }
    }

    return kind;
  },
);
