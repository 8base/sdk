import * as R from 'ramda';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { tablesListSelectors } from '../selectors';
import gqlPrettier from 'graphql-prettier';
import * as tableSelectors from '../selectors/tableSelectors';
import { TableSchema, QueryGeneratorConfig } from '../types';
import { createQueryString } from './createQueryString';

type QueryTableFilterConfig = {
  tableContentName?: string,
  appContentName?: string,
} & QueryGeneratorConfig

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


export const createTableFilterGraphqlTag = (tablesList: TableSchema[], tableId: string, config: QueryTableFilterConfig = {}) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);
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
  ${config.tableContentName ? `${config.tableContentName}: ` : ''}${SchemaNameGenerator.getTableListFieldName(table.name, appName)}(
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
        ${withResultData ? createQueryString(tablesList, table.id, { ...restConfig, prevSpaceCount: 6 }) : ''}
        _description
      }
      count
    }`)}
  }`);
};

export const createTableRowCreateTag = (tablesList: TableSchema[], tableId: string, config: QueryGeneratorConfig = {}) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const { withResultData = true, ...restConfig } = config;

  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return gqlPrettier(`
  mutation ${upperFirst(table.name)}Create($data: ${SchemaNameGenerator.getCreateInputName(table.name, appName)}!) {
    ${wrapInAppName(appName)(`
    ${SchemaNameGenerator.getCreateItemFieldName(table.name, appName)}(data: $data) {
        id
        ${withResultData ? createQueryString(tablesList, tableId, { withMeta: false, ...restConfig }) : ''}
      }`)}
    }`);
  }

  return gqlPrettier(`
  mutation ${upperFirst(table.name)}Create {
  ${wrapInAppName(appName)(`
    ${SchemaNameGenerator.getCreateItemFieldName(table.name, appName)} {
        id
        ${withResultData ? createQueryString(tablesList, tableId, { withMeta: false, ...restConfig }) : ''}
      }`)}
    }`,
  );
};

export const createTableRowCreateManyTag = (tablesList: TableSchema[], tableId: string) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);

  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return gqlPrettier(`
  mutation ${upperFirst(table.name)}CreateMany($data: [${SchemaNameGenerator.getCreateManyInputName(table.name, appName)}]!) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getCreateManyItemFieldName(table.name, appName)}(data: $data) {
          count
        }`)}
      }`,
    );
  }

  return `
  mutation ${upperFirst(table.name)}CreateMany {
  ${wrapInAppName(appName)(`
  ${SchemaNameGenerator.getCreateManyItemFieldName(table.name, appName)} {
      count
    }`)}
  }`;
};

export const createTableRowUpdateTag = (tablesList: TableSchema[], tableId: string, config: QueryGeneratorConfig = {}) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const { withResultData = true, ...restConfig } = config;

  return gqlPrettier(`
    mutation ${upperFirst(table.name)}Update(
      $data: ${SchemaNameGenerator.getUpdateInputName(table.name, appName)}!, 
      $filter: ${SchemaNameGenerator.getKeyFilterInputTypeName(table.name, appName)}
    ) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getUpdateItemFieldName(table.name, appName)}(data: $data, filter: $filter) {
          id
          ${withResultData ? createQueryString(tablesList, tableId, { withMeta: false, ...restConfig }) : ''}
        }`)}
      }`);
};

export const createTableRowQueryTag = (tablesList: TableSchema[], tableId: string, config: QueryGeneratorConfig = {}) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);
  const { withResultData = true, ...restConfig } = config;

  return gqlPrettier(`
    query ${upperFirst(table.name)}Entity($id: ID!) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getTableItemFieldName(table.name, appName)}(id: $id) {
          id
          ${withResultData ? createQueryString(tablesList, tableId, { ...restConfig }) : ''}
        }`)}
      }`);
};

export const createTableRowDeleteTag = (tablesList: TableSchema[], tableId: string) => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);
  const appName = tablesListSelectors.getTableApplicationName(tablesList, tableId);

  return gqlPrettier(`
    mutation ${upperFirst(table.name)}Delete($filter: ${SchemaNameGenerator.getKeyFilterInputTypeName(table.name, appName)}!, $force: Boolean) {
    ${wrapInAppName(appName)(`
      ${SchemaNameGenerator.getDeleteItemFieldName(table.name, appName)}(filter: $filter, force: $force) {
          success
        }`)}
      }`);
};
