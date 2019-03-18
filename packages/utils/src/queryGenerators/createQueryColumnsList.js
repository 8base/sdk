// @flow
import * as R from 'ramda';

import * as tableFieldSelectors from '../selectors/tableFieldSelectors';
import type { TableSchema, QueryGeneratorConfig } from '../types';


type CreateQueryColumnsListConfig = {
  flatten?: boolean,
} & QueryGeneratorConfig

const getTableByName = (tablesList: TableSchema[], tableName: string) =>
  tablesList.find(({ name }) => tableName === name);

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createQueryColumnsList = (
  tablesList: TableSchema[],
  tableName: string,
  config: CreateQueryColumnsListConfig = {},
  prevKey?: string = '',
) => {
  const { fields = [] } = getTableByName(tablesList, tableName) || {};
  const { deep = 3, withMeta = false, flatten = true, includeColumns } = config;

  const transformedList = fields
    .filter((field) => {
      const isMeta = tableFieldSelectors.isMetaField(field);
      const isIdField = tableFieldSelectors.isIdField(field);

      if (isIdField) {
        return false;
      }

      return withMeta
        ? true
        : !isMeta;
    })
    .map((field) => {
      const fieldName = tableFieldSelectors.getFieldName(field);
      const fieldType = tableFieldSelectors.getFieldType(field);
      const fieldTypeAttributes = tableFieldSelectors.getFieldTypesAttributes(field);
      const isRelation = tableFieldSelectors.isRelationField(field);
      const isFile = tableFieldSelectors.isFileField(field);
      const isList = tableFieldSelectors.isListField(field);
      const refTableName = tableFieldSelectors.getRelationTableName(field);
      const currentKeyString = prevKey ? `${prevKey}.${fieldName}` : fieldName;

      const title = capitalizeFirstLetter(fieldName);
      const refTable = getTableByName(tablesList, refTableName);

      const meta = {
        isList,
        fieldType,
        fieldTypeAttributes,
      };

      if (isFile) {
        return [{
          name: currentKeyString, title, meta,
        }];
      } else if (isRelation && isList) {
        return [{
          name: currentKeyString, title, meta,
        }];
      } else if (isRelation && refTableName && refTable && deep > 1) {
        const innerKeys = createQueryColumnsList(
          tablesList,
          refTableName,
          { deep: deep - 1, withMeta, includeColumns },
          currentKeyString,
        );

        return flatten
          ? [...innerKeys, { name: currentKeyString, title, meta }]
          : { name: currentKeyString, title, meta, children: innerKeys };
      } else if (isRelation) {
        return [{
          name: currentKeyString, title, meta,
        }];
      }
      return [{
        name: currentKeyString, title, meta,
      }];
    });

  return (R.flatten(transformedList): any)
    .filter(({ name }: Object) => !!includeColumns
      ? R.contains(name, includeColumns)
      : true,
    );
};
