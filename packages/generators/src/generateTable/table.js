// @flow

import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { SchemaNameGenerator } from '@8base/sdk';
import { createTableFilterGraphqlTag, createQueryColumnsList } from '@8base/utils';
import type { TableSchema } from '@8base/utils';
import type { GeneratorsConfig } from '../types';

import { chunks } from '../chunks';

// $FlowIgnore
import table from './table.js.ejs';


export const generateTable = (tablesList: TableSchema, tableName: string, config: GeneratorsConfig | void = { deep: 2 }) => {
  const entityName = pluralize.singular(tableName);

  const queryText = createTableFilterGraphqlTag(tablesList, tableName, { ...config, withMeta: false });
  const columns = createQueryColumnsList(tablesList, tableName, { ...config, withMeta: false });

  const tableGenerated = ejs.render(table, {
    chunks,
    queryText,
    columns,
    changeCase,
    pluralize,
    SchemaNameGenerator,
    tableName,
    entityName,
  });

  return tableGenerated;
};

