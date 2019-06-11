import * as R from 'ramda';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { tablesListSelectors } from '../selectors';
import gqlPrettier from 'graphql-prettier';
import * as tableSelectors from '../selectors/tableSelectors';
import { TableSchema, QueryGeneratorConfig } from '../types';
import { SDKError, PACKAGES, ERROR_CODES } from '../errors';
import { createQueryString } from './createQueryString';

type QueryTableFilterConfig = {
  tableContentName?: string;
  appContentName?: string;
} & QueryGeneratorConfig;

const upperFirst = (str: string) => R.toUpper(R.head(str)) + R.tail(str);

const wrapInAppName = (appName: string, appContentName?: string) => (queryString: string) => {
  if (!appName) {
    return queryString;
  }

  return `
    ${appContentName ? `${appContentName}: ` : ''}${appName} {
      ${queryString}
    }`;
};

const getTable = (tablesList: TableSchema[], tableId: string) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);

  if (!table) {
    throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.UTILS, `Table schema with ${tableId} id not found.`);
  }

  return table;
};

export const createTableFilterGraphqlTag = (
  tablesList: TableSchema[],
  tableId: string,
  config: QueryTableFilterConfig = {},
) => {
  const table = getTable(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const { withResultData = true, ...restConfig } = config;

  return gqlPrettier(`
  query ${upperFirst(table.name)}TableContent(
    $filter: ${SchemaNameGenerator.getFilterInputTypeName(table.name, appName)}
    $orderBy: [${SchemaNameGenerator.getOrderByInputTypeName(table.name, appName)}]
    $after: String
    $before: String
    $first: Int
    $last: Int
    $skip: Int
  ) {
  ${wrapInAppName(appName, config.appContentName)(`
  ${config.tableContentName ? `${config.tableContentName}: ` : ''}${SchemaNameGenerator.getTableListFieldName(
    table.name,
  )}(
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
        ${withResultData ? createQueryString(tablesList, table.id, { ...restConfig }) : ''}
        _description
      }
      count
    }`)}
  }`);
};

export const createTableRowCreateTag = (
  tablesList: TableSchema[],
  tableId: string,
  config: QueryGeneratorConfig = {},
) => {
  const table = getTable(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);
  const { withResultData = true, ...restConfig } = config;

  if (hasNonMetaFields) {
    return gqlPrettier(`
  mutation ${upperFirst(table.name)}Create($data: ${SchemaNameGenerator.getCreateInputName(table.name, appName)}!) {
    ${wrapInAppName(appName)(`
    ${SchemaNameGenerator.getCreateItemFieldName(table.name)}(data: $data) {
        id
        ${withResultData ? createQueryString(tablesList, tableId, { withMeta: false, ...restConfig }) : ''}
      }`)}
    }`);
  }

  return gqlPrettier(`
  mutation ${upperFirst(table.name)}Create {
  ${wrapInAppName(appName)(`
    ${SchemaNameGenerator.getCreateItemFieldName(table.name)} {
        id
        ${withResultData ? createQueryString(tablesList, tableId, { withMeta: false, ...restConfig }) : ''}
      }`)}
    }`);
};

export const createTableRowCreateManyTag = (tablesList: TableSchema[], tableId: string) => {
  const table = getTable(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return gqlPrettier(`
  mutation ${upperFirst(table.name)}CreateMany($data: [${SchemaNameGenerator.getCreateManyInputName(
      table.name,
      appName,
    )}]!) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getCreateManyItemFieldName(table.name)}(data: $data) {
          count
        }`)}
      }`);
  }

  return `
  mutation ${upperFirst(table.name)}CreateMany {
  ${wrapInAppName(appName)(`
  ${SchemaNameGenerator.getCreateManyItemFieldName(table.name)} {
      count
    }`)}
  }`;
};

export const createTableRowUpdateTag = (
  tablesList: TableSchema[],
  tableId: string,
  config: QueryGeneratorConfig = {},
) => {
  const table = getTable(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const { withResultData = true, ...restConfig } = config;

  return gqlPrettier(`
    mutation ${upperFirst(table.name)}Update(
      $data: ${SchemaNameGenerator.getUpdateInputName(table.name, appName)}!, 
      $filter: ${SchemaNameGenerator.getKeyFilterInputTypeName(table.name, appName)}
    ) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getUpdateItemFieldName(table.name)}(data: $data, filter: $filter) {
          id
          ${withResultData ? createQueryString(tablesList, tableId, { withMeta: false, ...restConfig }) : ''}
        }`)}
      }`);
};

export const createTableRowQueryTag = (
  tablesList: TableSchema[],
  tableId: string,
  config: QueryGeneratorConfig = {},
) => {
  const table = getTable(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const { withResultData = true, ...restConfig } = config;

  return gqlPrettier(`
    query ${upperFirst(table.name)}Entity($id: ID!) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getTableItemFieldName(table.name)}(id: $id) {
          id
          ${withResultData ? createQueryString(tablesList, tableId, { ...restConfig }) : ''}
        }`)}
      }`);
};

export const createTableRowDeleteTag = (tablesList: TableSchema[], tableId: string) => {
  const table = getTable(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);

  return gqlPrettier(`
    mutation ${upperFirst(table.name)}Delete($filter: ${SchemaNameGenerator.getKeyFilterInputTypeName(
    table.name,
    appName,
  )}!, $force: Boolean) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getDeleteItemFieldName(table.name)}(filter: $filter, force: $force) {
          success
        }`)}
      }`);
};
