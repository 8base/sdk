import * as R from 'ramda';
import { createSelector, type Selector } from 'reselect';
import { FIELD_TYPE } from '../constants';
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
