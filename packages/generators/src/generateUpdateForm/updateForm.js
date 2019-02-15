// @flow

import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { SchemaNameGenerator } from '@8base/sdk';
import { createTableRowUpdateTag } from '@8base/utils';
import type { TableSchema } from '@8base/utils';

import { chunks } from '../chunks';

// $FlowIgnore
import updateForm from './updateForm.js.ejs';


export const generateUpdateForm = (tablesList: TableSchema, tableName: string) => {
  const table = tablesList.find(({ name }) => tableName === name) || {};
  const fields = table.fields.filter(({ isMeta }) => !isMeta);
  const entityName = pluralize.singular(tableName);
  const mutationText = createTableRowUpdateTag(tablesList, tableName);

  const tableGenerated = ejs.render(updateForm, {
    chunks,
    mutationText,
    fields,
    tableName,
    entityName,
    SchemaNameGenerator,
    pluralize,
    changeCase,
  });

  return tableGenerated;
};

