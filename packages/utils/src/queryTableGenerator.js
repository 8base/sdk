// @flow
import * as R from 'ramda';
import { createSelector } from 'reselect';
import { SchemaNameGenerator } from '@8base/sdk';

import * as tableSelectors from './selectors/tableSelectors';
import * as tableFieldSelectors from './selectors/tableFieldSelectors';
import type { TableSchema } from './types';

export const TABLE_CONTENT_NAME = 'tableContent';

export type CheckedRule = {
  id: string,
  name: string,
  checked: boolean,
}

type QueryObjectConfig = {
  deep?: number,
  withMeta?: boolean,
  includeColumns?: string[],
}

type QueryStringConfig = {
  prevSpaceCount?: number,
  spaceCount?: number,
  initSpaceCount?: number,
} & QueryObjectConfig


const upperFirst = (str: string) => R.toUpper(R.head(str)) + R.tail(str);

const getTableByName = (tablesList: TableSchema[], tableName: string) =>
  tablesList.find(({ name }) => tableName === name);


const emptyRelation = {
  id: 'id',
  _description: '_description',
};

const emptyRelationList = {
  items: {
    id: 'id',
    _description: '_description',
  },
  count: 'count',
};

export const getQueryObject = (tablesList: TableSchema[], tableName: string, queryObjectConfig: QueryObjectConfig = {}, prevKey?: string = '') => {
  const { fields = [] } = getTableByName(tablesList, tableName) || {};
  const { deep = 3, withMeta = true, includeColumns } = queryObjectConfig;

  const queryObject = {};
  fields
    .filter((field) => {
      const isMeta = tableFieldSelectors.isMetaField(field);

      return withMeta
        ? true
        : !isMeta;
    })
    .forEach(field => {
      let fieldContent = field.name;
      const isRelation = tableFieldSelectors.isRelationField(field);
      const isFile = tableFieldSelectors.isFileField(field);
      const isSmart = tableFieldSelectors.isSmartField(field);
      const isList = tableFieldSelectors.isListField(field);
      const isSettingsRefTable = tableFieldSelectors.isSettingsRefTable(field);
      const refTableName = tableFieldSelectors.getRelationTableName(field);
      const refTable = getTableByName(tablesList, refTableName);
      const currentKeyString = prevKey ? `${prevKey}.${field.name}` : field.name;

      if (isSettingsRefTable) {
        fieldContent = {
          _description: '_description',
        };
      } else if (isRelation) {

        if (deep > 1) {
          if (!!refTableName && !!refTable) {
            const includeAllrelationFields = R.contains(currentKeyString, includeColumns);
            const relationIncludeColumns = includeAllrelationFields
              ? null
              : includeColumns;

            fieldContent = {
              id: 'id',
              ...getQueryObject(tablesList, refTableName, { deep: deep - 1, withMeta, includeColumns: relationIncludeColumns }, currentKeyString),
              _description: '_description',
            };
          } else {
            fieldContent = {
              id: 'id',
              _description: '_description',
            };
          }
        } else {
          fieldContent = null;
        }
      } else if (isFile) {
        fieldContent = {
          id: 'id',
          fileId: 'fileId',
          filename: 'filename',
          downloadUrl: 'downloadUrl',
          shareUrl: 'shareUrl',
          meta: 'meta',
        };
      } else if (isSmart) {
        fieldContent = field.fieldTypeAttributes.innerFields.reduce(
          (accum, { name }) => { accum[name] = name; return accum; },
          {},
        );
      }

      if (isList && (isRelation || isFile) && fieldContent !== null) {
        fieldContent = {
          items: fieldContent,
          count: 'count',
        };
      }

      const isNotEmptyrelation = isRelation && !R.equals(fieldContent, emptyRelation) && !R.equals(fieldContent, emptyRelationList);

      const needsInclude = !!includeColumns
        ? R.contains(currentKeyString, includeColumns)
        : true;

      console.log(currentKeyString, needsInclude, isNotEmptyrelation, includeColumns);

      if (fieldContent !== null && (needsInclude || isNotEmptyrelation)) {
        queryObject[field.name] = fieldContent;
      }
    });

  return queryObject;
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const transformQueryObjectToString = (queryObject: Object, spacesParams: *) => {
  const { prevSpaceCount = 4, spaceCount = 2, initSpaceCount = 2 } = spacesParams || {};

  const queryString = Object.keys(queryObject).reduce(
    (accum, queryElement) => {
      const spaces = R.repeat(' ', prevSpaceCount + spaceCount).join('');

      if (typeof queryObject[queryElement] === 'object') {
        const innerObjectString = transformQueryObjectToString(
          queryObject[queryElement],
          { prevSpaceCount, initSpaceCount, spaceCount: initSpaceCount + spaceCount },
        );

        accum += `\n${spaces}${queryElement} {${innerObjectString}\n${spaces}}`;
      } else {
        accum += `\n${spaces}${queryObject[queryElement]}`;
      }

      return accum;
    },
    '',
  );

  return queryString;
};


export const createQueryColumnsList = (tablesList: TableSchema[], tableName: string, queryObjectConfig: QueryObjectConfig = {}) => {
  const { fields = [] } = getTableByName(tablesList, tableName) || {};
  const { deep = 3, withMeta = false, includeColumns } = queryObjectConfig;

  const transformedList = fields
    .filter((field) => {
      const isMeta = tableFieldSelectors.isMetaField(field);

      return withMeta
        ? true
        : !isMeta;
    })
    .map((field) => {
      const fieldName = tableFieldSelectors.getFieldName(field);
      const fieldType = tableFieldSelectors.getFieldType(field);
      const isRelation = tableFieldSelectors.isRelationField(field);
      const isFile = tableFieldSelectors.isFileField(field);
      const isList = tableFieldSelectors.isListField(field);
      const refTableName = tableFieldSelectors.getRelationTableName(field);

      const title = capitalizeFirstLetter(fieldName);
      const refTable = getTableByName(tablesList, refTableName);

      const meta = {
        isList,
        fieldType,
      };

      if (isFile) {
        return [];
      } else if (isRelation && isList) {
        return [{
          name: fieldName, title, meta,
        }];
      } else if (isRelation && refTableName && refTable && deep > 1) {
        const innerKeys = createQueryColumnsList(tablesList, refTableName, { deep: deep - 1, withMeta, includeColumns });

        return innerKeys.map(({ name, ...rest }) => ({ ...rest, name: `${fieldName}.${name}` }));
      } else if (isRelation) {
        return [{
          name: fieldName, title, meta,
        }];
      }
      return [{
        name: fieldName, title, meta,
      }];
    });

  return R.flatten(transformedList)
    .filter(({ name }) => !!includeColumns
      ? R.contains(name, includeColumns)
      : true,
    );
};


export const createQueryString =
  (tablesList: TableSchema[], tableName: string, queryStringConfig?: QueryStringConfig = {}) => {
    const { prevSpaceCount, spaceCount, ...rest } = queryStringConfig;

    const gueryObject = getQueryObject(tablesList, tableName, {
      ...rest,
    });

    return transformQueryObjectToString(gueryObject, { prevSpaceCount, initSpaceCount: spaceCount, spaceCount });
  };

export const createQueryStringWithoutMetaFields =
  (tablesList: TableSchema[], tableName: string, queryStringConfig?: QueryStringConfig = {}) => {
    const { prevSpaceCount, spaceCount, ...rest } = queryStringConfig;

    const gueryObject = getQueryObject(tablesList, tableName, {
      withMeta: false,
      ...rest,
    });

    return transformQueryObjectToString(gueryObject, { prevSpaceCount, initSpaceCount: spaceCount, spaceCount });
  };

export const createTableFilterGraphqlTag = (tablesList: TableSchema[], tableName: string, config: * = {}) => `
  query DataViewerTable${upperFirst(tableName)}Content($filter: ${SchemaNameGenerator.getFilterInputTypeName(tableName)}, $orderBy: [${SchemaNameGenerator.getOrderByInputTypeName(tableName)}], $after: String, $before: String, $first: Int, $last: Int, $skip: Int) { 
    ${TABLE_CONTENT_NAME}: ${SchemaNameGenerator.getTableListFieldName(tableName)}(filter: $filter, orderBy: $orderBy, after: $after, before: $before, first: $first, last: $last, skip: $skip) {
      items {${createQueryString(tablesList, tableName, { ...config, prevSpaceCount: 6 })}
        _description
      }
      count
    }
  }`;

export const createTableRowCreateTag = (tablesList: TableSchema[], tableName: string) => {
  const table = getTableByName(tablesList, tableName);
  const hasNonMetaFields = tableSelectors.hasNonMetaFields(table);

  if (hasNonMetaFields) {
    return `
  mutation DataViewer${upperFirst(tableName)}RowCreate($data: ${SchemaNameGenerator.getCreateInputName(tableName)}!) {
    ${SchemaNameGenerator.getCreateItemFieldName(tableName)}(data: $data) {
      id${createQueryStringWithoutMetaFields(tablesList, tableName)}
    }
  }`;
  }

  return `
  mutation DataViewer${upperFirst(tableName)}RowCreate {
    ${SchemaNameGenerator.getCreateItemFieldName(tableName)} {
      id${createQueryStringWithoutMetaFields(tablesList, tableName)}
    }
  }`;
};

export const createTableRowUpdateTag = (tablesList: TableSchema[], tableName: string) => `
  mutation DataViewer${upperFirst(tableName)}RowUpdate($data: ${SchemaNameGenerator.getUpdateInputName(tableName)}!) {
    ${SchemaNameGenerator.getUpdateItemFieldName(tableName)}(data: $data) {
      id${createQueryStringWithoutMetaFields(tablesList, tableName)}
    }
  }`;

export const createTableRowQueryTag = (tablesList: TableSchema[], tableName: string) => `
  query DataViewer${upperFirst(tableName)}Row($id: ID!) {
    ${SchemaNameGenerator.getTableItemFieldName(tableName)}(id: $id) {${createQueryString(tablesList, tableName)}
    }
  }`;

export const createTableRowDeleteTag = (tablesList: TableSchema[], tableName: string) => `
  mutation DataViewer${upperFirst(tableName)}RowDelete($data: ${SchemaNameGenerator.getDeleteInputName(tableName)}!) {
    ${SchemaNameGenerator.getDeleteItemFieldName(tableName)}(data: $data) {
      success
    }
  }`;
