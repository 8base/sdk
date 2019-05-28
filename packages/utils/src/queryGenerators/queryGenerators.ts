import * as R from 'ramda';
import { SchemaNameGenerator } from '@8base/schema-name-generator';

import gqlPrettier from 'graphql-prettier';
import * as tableSelectors from '../selectors/tableSelectors';
import { TableSchema, QueryGeneratorConfig } from '../types';
import { createQueryString } from './createQueryString';

type QueryTableFilterConfig = {
  tableContentName?: string
} & QueryGeneratorConfig

const upperFirst = (str: string) => R.toUpper(R.head(str)) + R.tail(str);

const getTableByName = (tablesList: TableSchema[], tableName: string) =>
  tablesList.find(({ name }) => tableName === name);

export const createTableFilterGraphqlTag =
  (tablesList: TableSchema[], tableName: string, config: QueryTableFilterConfig = {}) => gqlPrettier(`
    query ${upperFirst(tableName)}TableContent(
      $filter: ${SchemaNameGenerator.getFilterInputTypeName(tableName)}
      $orderBy: [${SchemaNameGenerator.getOrderByInputTypeName(tableName)}]
      $after: String
      $before: String
      $first: Int
      $last: Int
      $skip: Int
    ) {
      ${config.tableContentName ? `${config.tableContentName}: ` : ''}${SchemaNameGenerator.getTableListFieldName(tableName)}(
        filter: $filter
        orderBy: $orderBy
        after: $after
        before: $before
        first: $first
        last: $last
        skip: $skip
      ) {
        items {
          id
          ${createQueryString(tablesList, tableName, { ...config })}
          _description
        }
        count
      }
    }`,
  );

export const createTableRowCreateTag = (tablesList: TableSchema[], tableName: string, config: QueryGeneratorConfig = {}) => {
  const table = getTableByName(tablesList, tableName);
  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return gqlPrettier(`
  mutation DataViewer${upperFirst(tableName)}RowCreate($data: ${SchemaNameGenerator.getCreateInputName(tableName)}!) {
    ${SchemaNameGenerator.getCreateItemFieldName(tableName)}(data: $data) {
      id
      ${createQueryString(tablesList, tableName, { withMeta: false, ...config })}
    }
  }`);
  }

  return gqlPrettier(`
  mutation DataViewer${upperFirst(tableName)}RowCreate {
    ${SchemaNameGenerator.getCreateItemFieldName(tableName)} {
      id
      ${createQueryString(tablesList, tableName, { withMeta: false, ...config })}
    }
  }`);
};

export const createTableRowCreateManyTag = (tablesList: TableSchema[], tableName: string) => {
  const table = getTableByName(tablesList, tableName);
  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return gqlPrettier(`
  mutation DataViewer${upperFirst(tableName)}RowCreateMany($data: [${SchemaNameGenerator.getCreateManyInputName(tableName)}]!) {
    ${SchemaNameGenerator.getCreateManyItemFieldName(tableName)}(data: $data) {
      count
    }
  }`);
  }

  return gqlPrettier(`
  mutation DataViewer${upperFirst(tableName)}RowCreateMany {
    ${SchemaNameGenerator.getCreateManyItemFieldName(tableName)} {
      count
    }
  }`);
};

export const createTableRowUpdateTag = (tablesList: TableSchema[], tableName: string, config: QueryGeneratorConfig = {}) => gqlPrettier(`
  mutation DataViewer${upperFirst(tableName)}RowUpdate($data: ${SchemaNameGenerator.getUpdateInputName(tableName)}!, $filter: ${SchemaNameGenerator.getKeyFilterInputTypeName(tableName)}) {
    ${SchemaNameGenerator.getUpdateItemFieldName(tableName)}(data: $data, filter: $filter) {
      id
      ${createQueryString(tablesList, tableName, { withMeta: false, ...config })}
    }
  }`);

export const createTableRowQueryTag = (tablesList: TableSchema[], tableName: string, config: QueryGeneratorConfig = {}) => gqlPrettier(`
  query DataViewer${upperFirst(tableName)}Row($id: ID!) {
    ${SchemaNameGenerator.getTableItemFieldName(tableName)}(id: $id) {
      ${createQueryString(tablesList, tableName, { ...config })}
    }
  }`);

export const createTableRowDeleteTag = (tablesList: TableSchema[], tableName: string) => gqlPrettier(`
  mutation DataViewer${upperFirst(tableName)}RowDelete($filter: ${SchemaNameGenerator.getKeyFilterInputTypeName(tableName)}!, $force: Boolean) {
    ${SchemaNameGenerator.getDeleteItemFieldName(tableName)}(filter: $filter, force: $force) {
      success
    }
  }`);
