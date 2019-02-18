// @flow

import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { SchemaNameGenerator } from '@8base/sdk';
import { createTableFilterGraphqlTag, createQueryColumnsList } from '@8base/utils';
import type { TableSchema } from '@8base/utils';

import { chunks } from '../chunks';

// $FlowIgnore
import table from './table.js.ejs';


export const generateTable = (tablesList: TableSchema, tableName: string) => {
  const entityName = pluralize.singular(tableName);

  const queryText = createTableFilterGraphqlTag(tablesList, tableName, { deep: 2, withMeta: false });
  const columns = createQueryColumnsList(tablesList, tableName);

  const tableGenerated = ejs.render(table, {
    chunks,
    queryText,
    columns,
    queryName: SchemaNameGenerator.getTableListFieldName(tableName),
    tableName: {
      original: tableName,
      lowerCase: changeCase.lower(tableName),
    },
    entityName: {
      lowerCase: changeCase.lower(entityName),
      pascalCase: changeCase.pascal(entityName),
      upperCase: changeCase.upper(entityName),
    },
  });

  return tableGenerated;
};

