// @flow
import * as R from 'ramda';
import { createSelector } from 'reselect';
import { SchemaNameGenerator } from '@8base/sdk';

import * as tableSelectors from './tableSelectors';
import type { TableSchema } from '@8base/utils';

export const TABLE_CONTENT_NAME = 'tableContent';

export type CheckedRule = {
  id: string,
  name: string,
  checked: boolean,
}

const upperFirst = (str: string) => R.toUpper(R.head(str)) + R.tail(str);

const getFieldPartOfTheQuery = createSelector(
  tableSelectors.getFieldNameById,
  tableSelectors.isRelationField,
  tableSelectors.isFileField,
  (fieldName, isRelation, isFile) => {
    if (isRelation) return `${fieldName} { id _description }`;
    if (isFile) return `${fieldName} { id fileId filename }`;
    return fieldName;
  },
);

const getNonMetaFieldPartOfTheQuery = createSelector(
  getFieldPartOfTheQuery,
  tableSelectors.isMetaField,
  (fieldPart, isMeta) =>
    isMeta
      ? ''
      : fieldPart,
);

export const createFieldsEmptyObject = () => R.reduce(
  (accum, field) => R.assoc(field, undefined, accum),
  {},
);

export const createQueryString = (table: TableSchema) =>
  R.reduce(
    (accum, field) => `${accum + getFieldPartOfTheQuery(table, field.id)}\n      `,
    '',
  )(table.fields || []);

export const createQueryStringWithoutMetaFields = (table: TableSchema) =>
  R.reduce(
    (accum, field) => `${accum + getNonMetaFieldPartOfTheQuery(table, field.id)}\n      `,
    '',
  )(table.fields || []);

export const createTableFilterGraphqlTag = (table: TableSchema = {}) => `
  query DataViewerTable${upperFirst(table.name)}Content($filter: ${SchemaNameGenerator.getFilterInputTypeName(table.name)}, $orderBy: [${SchemaNameGenerator.getOrderByInputTypeName(table.name)}], $after: String, $before: String, $first: Int, $last: Int, $skip: Int) { 
    ${TABLE_CONTENT_NAME}: ${SchemaNameGenerator.getGetListItemFieldName(table.name)}(filter: $filter, orderBy: $orderBy, after: $after, before: $before, first: $first, last: $last, skip: $skip) {
      ${createQueryString(table)}

      _description
      id
    }
  }`;

export const createTableRowCreateTag = (table: TableSchema = {}) => `
  mutation DataViewer${upperFirst(table.name)}RowCreate($data: ${SchemaNameGenerator.getCreateInputName(table.name)}) {
    ${SchemaNameGenerator.getCreateItemFieldName(table.name)}(data: $data) {
      ${createQueryStringWithoutMetaFields(table)}

      id
    }
  }`;

export const createTableRowUpdateTag = (table: TableSchema = {}) => `
  mutation DataViewer${upperFirst(table.name)}RowUpdate($data: ${SchemaNameGenerator.getUpdateInputName(table.name)}) {
    ${SchemaNameGenerator.getUpdateItemFieldName(table.name)}(data: $data) {
      ${createQueryStringWithoutMetaFields(table)}

      id
    }
  }`;

export const createTableRowQueryTag = (table: TableSchema = {}) => `
  query DataViewer${upperFirst(table.name)}Row($id: ID!) {
    ${SchemaNameGenerator.getGetItemFieldName(table.name)}(id: $id) {
      ${createQueryString(table)}

      id
    }
  }`;

export const createTableRowDeleteTag = (table: TableSchema = {}) => `
  mutation DataViewer${upperFirst(table.name)}RowDelete($data: ${SchemaNameGenerator.getDeleteInputName(table.name)}) {
    ${SchemaNameGenerator.getDeleteItemFieldName(table.name)}(data: $data) {
      success
    }
  }`;
