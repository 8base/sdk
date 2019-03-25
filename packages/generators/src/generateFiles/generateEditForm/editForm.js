// @flow
import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { createTableRowUpdateTag, tableSelectors } from '@8base/utils';
import type { GeneratorsConfig, GeneratorsData } from '../../types';
import { isFieldNeedsToInclude } from '../../utils';
import { formatCode } from '../../formatCode';
import { chunks } from '../chunks';

// $FlowIgnore
import editForm from './editForm.js.ejs';


export const generateEditForm = ({ tablesList, tableName, screenName }: GeneratorsData, { includeColumns }: GeneratorsConfig = {}) => {
  const table = tablesList.find(({ name }) => tableName === name);

  if (!table) { throw new Error(`Can't find a table ${tableName}`); }

  const entityName = pluralize.singular(tableName);
  const mutationText = createTableRowUpdateTag(tablesList, tableName);
  const fields = table.fields.filter(({ isMeta, name }) => !isMeta && isFieldNeedsToInclude(name, includeColumns));

  const tableGenerated = ejs.render(editForm, {
    chunks,
    tableSelectors,
    table,
    mutationText,
    fields,
    tableName,
    entityName,
    SchemaNameGenerator,
    pluralize,
    changeCase,
    screenName: screenName || entityName,
  });

  return formatCode(tableGenerated);
};

