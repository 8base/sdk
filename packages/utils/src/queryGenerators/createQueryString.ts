import * as R from 'ramda';

import * as tableFieldSelectors from '../selectors/tableFieldSelectors';
import { SYSTEM_TABLES } from '../constants';
import { TableSchema, QueryGeneratorConfig } from '../types';

export type CheckedRule = {
  id: string;
  name: string;
  checked: boolean;
};

const DEFAULT_DEPTH = 1;

const getTableByName = (tablesList: TableSchema[], tableName: string) =>
  tablesList.find(({ name }) => tableName === name);

export const createQueryString = (
  tablesList: TableSchema[],
  tableName: string,
  queryObjectConfig: QueryGeneratorConfig = {},
  prevKey: string = '',
): string => {
  const { fields = [] } = getTableByName(tablesList, tableName) || {};
  const { deep = DEFAULT_DEPTH, withMeta = true, relationItemsCount, includeColumns } = queryObjectConfig;

  let queryObject = '';

  fields
    .filter(field => {
      const isMeta = tableFieldSelectors.isMetaField(field);

      return withMeta ? true : !isMeta;
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
      let isNotEmptyRelation = false;

      if (isSettingsRefTable) {
        fieldContent = `{
          _description
        }`;
      } else if (isRelation) {
        if (deep <= 1 || !refTableName || !refTable) {
          fieldContent = `{
              id
              _description
            }`;
        } else {
          const includeAllrelationFields = R.contains(currentKeyString, includeColumns || []);
          const relationIncludeColumns = includeAllrelationFields ? null : includeColumns;

          const innerFields = createQueryString(
            tablesList,
            refTableName,
            {
              deep: deep - 1,
              includeColumns: relationIncludeColumns,
              withMeta,
            },
            currentKeyString,
          );

          isNotEmptyRelation = !R.isEmpty(innerFields);

          fieldContent = `{
            id
            ${innerFields}
            _description
          }`;
        }
      } else if (isFile) {
        fieldContent = `{
          id
          fileId
          filename
          downloadUrl
          shareUrl
          meta
        }`;
      } else if (isSmart) {
        fieldContent = `{${field.fieldTypeAttributes.innerFields.reduce((accum: string, { name }: { name: string }) => {
          accum += `\n${name}`;
          return accum;
        }, '')}}`;
      }

      if (isList && (isRelation || isFile) && fieldContent !== null) {
        fieldContent = `{
          items ${fieldContent}
          count
        }`;
      }

      const needsInclude = !!includeColumns ? R.contains(currentKeyString, includeColumns) : true;

      if (fieldContent !== null && (needsInclude || isNotEmptyRelation)) {
        if (!!relationItemsCount && isList && isRelation) {
          queryObject += `\n${field.name}(first: ${relationItemsCount}) ${fieldContent}`;
        } else {
          queryObject += `\n${field.name} ${fieldContent}`;
        }
      }
    });

  return queryObject;
};
