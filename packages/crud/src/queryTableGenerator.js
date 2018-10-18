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
  tableSelectors.getFieldById,
  tableSelectors.isRelationField,
  tableSelectors.isFileField,
  tableSelectors.isCustomField,
  tableSelectors.isListField,
  (field, isRelation, isFile, isCustom, isList) => {
    let postfix = '';

    if (isRelation) {
      postfix = '{ id _description }';
    } else if (isFile) {
      postfix = '{ id fileId filename downloadUrl shareUrl }';
    } else if (isCustom) {
      postfix = `{ ${field.fieldTypeAttributes.innerFields.map(({ name }) => name).join(' ')} }`;
    }

    if (isList && (isRelation || isFile)) {
      postfix = `{ items ${postfix} }`;
    }

    return postfix ? `${field.name} ${postfix}` : field.name;
  },
);

const createQueryFromFields = (table, spaceCount = 6) => R.pipe(
  R.reduce((accum, field) => [...accum, getFieldPartOfTheQuery(table, field.id)], []),
  R.join(`\n${R.repeat(' ', spaceCount).join('')}`),
);

export const createQueryString = (table: TableSchema, spaceCount?: number) => createQueryFromFields(
  table,
  spaceCount,
)(R.propOr([], 'fields', table));

export const createQueryStringWithoutMetaFields = (table: TableSchema, spaceCount?: number) => R.pipe(
  R.filter((field) => !tableSelectors.isMetaField(table, field.id)),
  createQueryFromFields(table, spaceCount),
)(R.propOr([], 'fields', table));

export const createTableFilterGraphqlTag = (table: TableSchema) => `
  query DataViewerTable${upperFirst(table.name)}Content($filter: ${SchemaNameGenerator.getFilterInputTypeName(table.name)}, $orderBy: [${SchemaNameGenerator.getOrderByInputTypeName(table.name)}], $after: String, $before: String, $first: Int, $last: Int, $skip: Int) { 
    ${TABLE_CONTENT_NAME}: ${SchemaNameGenerator.getTableListFieldName(table.name)}(filter: $filter, orderBy: $orderBy, after: $after, before: $before, first: $first, last: $last, skip: $skip) {
      items {
        ${createQueryString(table, 8)}
        _description
      }
      count
    }
  }`;

export const createTableRowCreateTag = (table: TableSchema) => {
  const hasUserFields = tableSelectors.hasUserFields(table);

  if (hasUserFields) {
    return `
  mutation DataViewer${upperFirst(table.name)}RowCreate($data: ${SchemaNameGenerator.getCreateInputName(table.name)}) {
    ${SchemaNameGenerator.getCreateItemFieldName(table.name)}(data: $data) {
      ${createQueryStringWithoutMetaFields(table)}
      id
    }
  }`;
  }

  return `
  mutation DataViewer${upperFirst(table.name)}RowCreate {
    ${SchemaNameGenerator.getCreateItemFieldName(table.name)} {
      ${createQueryStringWithoutMetaFields(table)}
      id
    }
  }`;
};

export const createTableRowUpdateTag = (table: TableSchema) => `
  mutation DataViewer${upperFirst(table.name)}RowUpdate($data: ${SchemaNameGenerator.getUpdateInputName(table.name)}) {
    ${SchemaNameGenerator.getUpdateItemFieldName(table.name)}(data: $data) {
      ${createQueryStringWithoutMetaFields(table)}
      id
    }
  }`;

export const createTableRowQueryTag = (table: TableSchema) => `
  query DataViewer${upperFirst(table.name)}Row($id: ID!) {
    ${SchemaNameGenerator.getTableItemFieldName(table.name)}(id: $id) {
      ${createQueryString(table)}
    }
  }`;

export const createTableRowDeleteTag = (table: TableSchema) => `
  mutation DataViewer${upperFirst(table.name)}RowDelete($data: ${SchemaNameGenerator.getDeleteInputName(table.name)}) {
    ${SchemaNameGenerator.getDeleteItemFieldName(table.name)}(data: $data) {
      success
    }
  }`;
