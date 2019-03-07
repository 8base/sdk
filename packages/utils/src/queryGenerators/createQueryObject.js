// @flow
import * as R from 'ramda';

import * as tableFieldSelectors from '../selectors/tableFieldSelectors';
import { SYSTEM_TABLES } from '../constants';
import type { TableSchema, QueryGeneratorConfig } from '../types';

export type CheckedRule = {
  id: string,
  name: string,
  checked: boolean,
}

const DEFAULT_DEPTH = 1;

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


export const createQueryObject = (
  tablesList: TableSchema[],
  tableName: string,
  queryObjectConfig: QueryGeneratorConfig = {},
  prevKey?: string = '',
) => {
  const { fields = [] } = getTableByName(tablesList, tableName) || {};
  const {
    deep = DEFAULT_DEPTH,
    withMeta = true,
    includeColumns,
  } = queryObjectConfig;

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
      const refTableName = tableFieldSelectors.getRelationTableName(field);
      const refTable = getTableByName(tablesList, refTableName);
      const isSettingsRefTable = tableFieldSelectors.getRelationTableName(field) === SYSTEM_TABLES.SETTINGS;
      const currentKeyString = prevKey ? `${prevKey}.${field.name}` : field.name;

      if (isSettingsRefTable) {
        fieldContent = {
          _description: '_description',
        };
      } else if (isRelation) {
        if (deep > 1) {

          if (!!refTableName && !!refTable) {
            const includeAllrelationFields = R.contains(currentKeyString, includeColumns || []);
            const relationIncludeColumns = includeAllrelationFields
              ? null
              : includeColumns;

            fieldContent = {
              id: 'id',
              ...createQueryObject(
                tablesList,
                refTableName,
                { deep: deep - 1, withMeta, includeColumns: relationIncludeColumns },
                currentKeyString,
              ),
              _description: '_description',
            };
          } else {
            fieldContent = {
              id: 'id',
              _description: '_description',
            };
          }
        } else {
          fieldContent = {
            id: 'id',
            _description: '_description',
          };
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

      const isNotEmptyRelation = isRelation && !R.equals(fieldContent, emptyRelation) && !R.equals(fieldContent, emptyRelationList);

      const needsInclude = !!includeColumns
        ? R.contains(currentKeyString, includeColumns)
        : true;

      if (fieldContent !== null && (needsInclude || isNotEmptyRelation)) {
        queryObject[field.name] = fieldContent;
      }
    });

  return queryObject;
};
