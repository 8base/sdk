// @flow
import * as R from 'ramda';
import { SchemaNameGenerator } from '@8base/schema-name-generator';

import * as tableSelectors from '../selectors/tableSelectors';
import type { TableSchema, QueryGeneratorConfig } from '../types';
import { createQueryObject } from './createQueryObject';
import { transformQueryObjectToString } from './transformQueryObjectToString';

type QueryStringConfig = {
  prevSpaceCount?: number,
  spaceCount?: number,
  initSpaceCount?: number,
} & QueryGeneratorConfig

type QueryTableFilterConfig = {
  tableContentName?: string
} & QueryGeneratorConfig

const upperFirst = (str: string) => R.toUpper(R.head(str)) + R.tail(str);

const getTableByName = (tablesList: TableSchema[], tableName: string) =>
  tablesList.find(({ name }) => tableName === name);


const createQueryString =
  (tablesList: TableSchema[], tableName: string, queryStringConfig?: QueryStringConfig = {}) => {
    const { prevSpaceCount, spaceCount, ...rest } = queryStringConfig;

    const gueryObject = createQueryObject(tablesList, tableName, {
      ...rest,
    });

    return transformQueryObjectToString(gueryObject, { prevSpaceCount, initSpaceCount: spaceCount, spaceCount });
  };


export const createTableFilterGraphqlTag = (tablesList: TableSchema[], tableName: string, config: QueryTableFilterConfig = {}) => `
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
        id${createQueryString(tablesList, tableName, { ...config, prevSpaceCount: 6 })}
        _description
      }
      count
    }
  }`;

export const createTableRowCreateTag = (tablesList: TableSchema[], tableName: string, config: QueryGeneratorConfig = {}) => {
  const table = getTableByName(tablesList, tableName);
  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return `
  mutation DataViewer${upperFirst(tableName)}RowCreate($data: ${SchemaNameGenerator.getCreateInputName(tableName)}!) {
    ${SchemaNameGenerator.getCreateItemFieldName(tableName)}(data: $data) {
      id${createQueryString(tablesList, tableName, { withMeta: false, ...config })}
    }
  }`;
  }

  return `
  mutation DataViewer${upperFirst(tableName)}RowCreate {
    ${SchemaNameGenerator.getCreateItemFieldName(tableName)} {
      id${createQueryString(tablesList, tableName, { withMeta: false, ...config })}
    }
  }`;
};

export const createTableRowUpdateTag = (tablesList: TableSchema[], tableName: string, config: QueryGeneratorConfig = {}) => `
  mutation DataViewer${upperFirst(tableName)}RowUpdate($data: ${SchemaNameGenerator.getUpdateInputName(tableName)}!) {
    ${SchemaNameGenerator.getUpdateItemFieldName(tableName)}(data: $data) {
      id${createQueryString(tablesList, tableName, { withMeta: false, ...config })}
    }
  }`;

export const createTableRowQueryTag = (tablesList: TableSchema[], tableName: string, config: QueryGeneratorConfig = {}) => `
  query DataViewer${upperFirst(tableName)}Row($id: ID!) {
    ${SchemaNameGenerator.getTableItemFieldName(tableName)}(id: $id) {${createQueryString(tablesList, tableName, { ...config })}
    }
  }`;

export const createTableRowDeleteTag = (tablesList: TableSchema[], tableName: string) => `
  mutation DataViewer${upperFirst(tableName)}RowDelete($data: ${SchemaNameGenerator.getDeleteInputName(tableName)}!) {
    ${SchemaNameGenerator.getDeleteItemFieldName(tableName)}(data: $data) {
      success
    }
  }`;
