import * as R from 'ramda';

import { SYSTEM_TABLES } from '../constants';
import { TableSchema, QueryGeneratorConfig } from '../types';
import { tablesListSelectors, tableFieldSelectors } from '../selectors';
import { SDKError, PACKAGES, ERROR_CODES } from '../errors';

export type CheckedRule = {
  id: string;
  name: string;
  checked: boolean;
};

const DEFAULT_DEPTH = 1;

export const createQueryString = (
  tablesList: TableSchema[],
  tableId: string,
  queryObjectConfig: QueryGeneratorConfig = {},
  prevKey: string = '',
): string => {
  const table = tablesListSelectors.getTableById(tablesList, tableId);

  if (!table) {
    throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.UTILS, `Table with id ${tableId} not found`);
  }

  const { fields, name: tableName } = table;

  const {
    deep = DEFAULT_DEPTH,
    withMeta = true,
    relationItemsCount,
    includeColumns,
    permissions = {},
  } = queryObjectConfig;

  let queryObject = '';

  fields
    .filter(field => {
      const isMeta = tableFieldSelectors.isMetaField(field);
      const isRelation = tableFieldSelectors.isRelationField(field);

      let shouldIncludeField = withMeta ? true : !isMeta;

      if (isRelation) {
        const refTableName = tableFieldSelectors.getRelationTableName(field);
        const refTableAllowed = R.pathOr(true, ['data', refTableName, 'permission', 'read', 'allow'], permissions);

        shouldIncludeField = refTableAllowed && shouldIncludeField;
      } else {
        const fieldAllowed = R.pathOr(
          true,
          ['data', tableName, 'permission', 'read', 'fields', field.name],
          permissions,
        );

        shouldIncludeField = fieldAllowed && shouldIncludeField;
      }

      return shouldIncludeField;
    })
    .forEach(field => {
      let fieldContent = field.name;
      const isRelation = tableFieldSelectors.isRelationField(field);
      const isMissingRelation = tableFieldSelectors.isMissingRelationField(field);
      const isOneWayRelationField = tableFieldSelectors.isOneWayRelationField(field);
      const isFile = tableFieldSelectors.isFileField(field);
      const isSmart = tableFieldSelectors.isSmartField(field);
      const isList = tableFieldSelectors.isListField(field);
      const refTableId = tableFieldSelectors.getRelationTableId(field);
      const refTable = tablesListSelectors.getTableById(tablesList, refTableId);

      const isSettingsRefTable =
        tableFieldSelectors.isSystemField(field) &&
        tableFieldSelectors.getRelationTableName(field) === SYSTEM_TABLES.SETTINGS;

      const isPermissionsRefTable =
        tableFieldSelectors.isSystemField(field) &&
        tableFieldSelectors.getRelationTableName(field) === SYSTEM_TABLES.PERMISSIONS;

      const currentKeyString = prevKey ? `${prevKey}.${field.name}` : field.name;
      let isNotEmptyRelation = false;

      if (isSettingsRefTable || isPermissionsRefTable) {
        fieldContent = `{
          _description
        }`;
      } else if (isMissingRelation) {
        fieldContent = `{
          table
        }`;
      } else if (isRelation || isOneWayRelationField) {
        if (deep <= 1 || !refTableId || !refTable) {
          fieldContent = `{
              id
              _description
            }`;
        } else {
          const includeAllrelationFields = R.contains(currentKeyString, includeColumns || []);
          const relationIncludeColumns = includeAllrelationFields ? null : includeColumns;

          const innerFields = createQueryString(
            tablesList,
            refTableId,
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
