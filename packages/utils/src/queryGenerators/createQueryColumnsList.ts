import * as R from 'ramda';

import { tablesListSelectors, tableFieldSelectors } from '../selectors';
import { TableSchema, QueryGeneratorConfig } from '../types';

type CreateQueryColumnsListConfig = {
  flatten?: boolean;
} & QueryGeneratorConfig;

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createQueryColumnsList = (
  tablesList: TableSchema[],
  tableId: string,
  config: CreateQueryColumnsListConfig = {},
  prevKey: string = '',
): Array<{ name: string; title: string; meta: object }> => {
  const { fields = [] } = tablesListSelectors.getTableById(tablesList, tableId) || {};
  const { deep = 1, withMeta = true, flatten = true, includeColumns } = config;

  const transformedList = fields
    .filter(field => {
      const isMeta = tableFieldSelectors.isMetaField(field);
      const isIdField = tableFieldSelectors.isIdField(field);

      if (isIdField) {
        return false;
      }

      return withMeta ? true : !isMeta;
    })
    .map(field => {
      const fieldName = tableFieldSelectors.getFieldName(field);
      const fieldType = tableFieldSelectors.getFieldType(field);
      const fieldTypeAttributes = tableFieldSelectors.getFieldTypesAttributes(field);
      const isRelation = tableFieldSelectors.isRelationField(field);
      const isFile = tableFieldSelectors.isFileField(field);
      const isList = tableFieldSelectors.isListField(field);
      const refTableId = tableFieldSelectors.getRelationTableId(field);
      const refTable = tablesListSelectors.getTableById(tablesList, refTableId);
      const currentKeyString = prevKey ? `${prevKey}.${fieldName}` : fieldName;

      const title = capitalizeFirstLetter(fieldName);

      const meta = {
        fieldType,
        fieldTypeAttributes,
        isList,
      };

      if (isFile) {
        return [
          {
            meta,
            name: currentKeyString,
            title,
          },
        ];
      } else if (isRelation && isList) {
        return [
          {
            name: currentKeyString,
            title,
            meta,
          },
        ];
      } else if (isRelation && refTableId && refTable && deep > 1) {
        const innerKeys = createQueryColumnsList(
          tablesList,
          refTableId,
          { deep: deep - 1, withMeta, includeColumns },
          currentKeyString,
        );

        return flatten
          ? [...innerKeys, { name: currentKeyString, title, meta }]
          : { name: currentKeyString, title, meta, children: innerKeys };
      } else if (isRelation) {
        return [
          {
            meta,
            name: currentKeyString,
            title,
          },
        ];
      }
      return [
        {
          meta,
          name: currentKeyString,
          title,
        },
      ];
    });

  return R.flatten<any>(transformedList).filter(({ name }: { name: string }) =>
    !!includeColumns ? R.contains(name, includeColumns) : true,
  );
};
