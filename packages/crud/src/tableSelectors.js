// @flow

import * as R from 'ramda';
import { createSelector, type Selector } from 'reselect';
import { FIELD_TYPE } from '@8base/utils';
import type { TableSchema, FieldSchema } from '@8base/utils';

export const getTable = (table?: TableSchema): TableSchema | void => table;

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

export const isCustomField = createSelector(
  getFieldTypeById,
  R.equals(FIELD_TYPE.CUSTOM),
);

export const isMetaField = createSelector(
  getFieldById,
  R.propEq('isMeta', true),
);

export const getFieldNameById = createSelector(
  getFieldById,
  R.prop('name'),
);
