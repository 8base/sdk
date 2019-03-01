// @flow

import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { createTableFilterGraphqlTag, createQueryColumnsList, tableSelectors } from '@8base/utils';
import type { TableSchema } from '@8base/utils';
import type { GeneratorsConfig } from '../types';
import { formatCode } from '../formatCode';
import { chunks } from '../chunks';

// $FlowIgnore
import tableTemplate from './table.js.ejs';


export const generateTable = (tablesList: TableSchema, tableName: string, config: GeneratorsConfig | void = { deep: 2, withMeta: false }) => {
  const table = tablesList.find(({ name }) => tableName === name);

  if (!table) { throw new Error(`Can't find a table ${tableName}`); }

  const entityName = pluralize.singular(tableName);
  const queryText = createTableFilterGraphqlTag(tablesList, tableName, config);
  const columns = createQueryColumnsList(tablesList, tableName, config);

  const tableGenerated = ejs.render(tableTemplate, {
    chunks,
    tableSelectors,
    table,
    queryText,
    columns,
    changeCase,
    pluralize,
    SchemaNameGenerator,
    tableName,
    entityName,
  });

  return formatCode(tableGenerated);
};

