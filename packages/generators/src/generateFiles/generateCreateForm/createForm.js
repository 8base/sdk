// @flow

import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { tableSelectors } from '@8base/utils';
import type { GeneratorsConfig, GeneratorsData } from '../../types';
import { chunks } from '../chunks';
import { isFieldNeedsToInclude } from '../../utils';
import { formatCode } from '../../formatCode';

// $FlowIgnore
import createForm from './createForm.js.ejs';


export const generateCreateForm = ({ tablesList, tableName, screenName }: GeneratorsData, { includeColumns }: GeneratorsConfig = {}) => {
  const table = tablesList.find(({ name }) => tableName === name);

  if (!table) { throw new Error(`Can't find a table ${tableName}`); }

  const entityName = pluralize.singular(tableName);
  const fields = table.fields.filter(({ isMeta, name }) => !isMeta && isFieldNeedsToInclude(name, includeColumns));

  const tableGenerated = ejs.render(createForm, {
    chunks,
    tableSelectors,
    table,
    fields,
    changeCase,
    tableName,
    entityName,
    SchemaNameGenerator,
    pluralize,
    screenName: screenName || entityName,
  });

  return formatCode(tableGenerated);
};


