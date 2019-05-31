// @flow
import * as R from 'ramda';
import errorCodes from '@8base/error-codes';
import type { Schema } from '@8base/utils';
import type { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, TABLE_CREATE_MUTATION, FIELD_CREATE_MUTATION } from './constants';

type ImportTablesOptions = {
  debug?: boolean,
};

const handleError = (message: string, e: Object, debug: boolean) => {
  // eslint-disable-next-line no-console
  console.warn(message);

  if (debug) {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(e.response, null, 2));
  } else if (R.pathEq(['response', 'errors', 0, 'code'], errorCodes.ValidationErrorCode, e)) {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(R.path(['response', 'errors', 0, 'details'], e), null, 2));
  } else {
    // eslint-disable-next-line no-console
    console.warn(R.path(['response', 'errors', 0, 'message'], e));
  }
};

export const importTables = async (
  request: (query: string | DocumentNode, variables?: Object) => Promise<Object>,
  schema: Schema,
  options: ImportTablesOptions = {},
) => {
  const debug = R.propOr(false, 'debug', options);

  for (const table of schema) {
    try {
      await request(TABLE_CREATE_MUTATION, {
        data: {
          name: table.name,
          displayName: table.displayName,
        },
      });
    } catch (e) {
      handleError(`\nCan't create table "${table.name}"`, e, debug);
    }
  }

  const tablesListData = await request(TABLES_LIST_QUERY, {
    filter: {
      onlyUserTables: false,
    },
  });

  const tablesByName = R.indexBy(R.prop('name'), tablesListData.tablesList.items);

  for (const schemaTable of schema) {
    if (schemaTable.isSystem) {
      continue;
    }

    const table = tablesByName[schemaTable.name];

    for (const schemaField of schemaTable.fields) {
      if (schemaField.isSystem) {
        continue;
      }

      const field = R.pick([
        'name',
        'displayName',
        'fieldType',
        'isList',
        'isRequired',
        'isUnique',
        'defaultValue',
        'description',
        'fieldTypeAttributes',
        'relation',
        'tableId',
      ], schemaField);

      if (field.fieldTypeAttributes) {
        field.fieldTypeAttributes = R.pick([
          'format',
          'fieldSize',
          'listOptions',
          'precision',
          'currency',
          'minValue',
          'maxValue',
          'maxSize',
          'typeRestrictions',
          'isBigInt',
        ], field.fieldTypeAttributes);
      }

      if (field.relation) {
        const refTableName = field.relation.refTable.name;

        const refTable = tablesByName[refTableName];

        if (refTable.relations && refTable.relations[schemaTable.name]) {
          if (refTable.relations[schemaTable.name].includes(field.name)) {
            continue;
          }
        }

        field.relation = {
          ...R.pick([
            'refFieldIsList',
            'refFieldIsRequired',
            'refFieldName',
            'refFieldDisplayName',
          ], field.relation),
          refTableId: refTable.id,
        };

        table.relations = table.relations || {};

        if (table.relations[refTableName]) {
          table.relations[refTableName].push(field.relation.refFieldName);
        } else {
          table.relations[refTableName] = [field.relation.refFieldName];
        }
      }

      field.tableId = table.id;

      try {
        await request(FIELD_CREATE_MUTATION, {
          data: field,
        });
      } catch (e) {
        handleError(`\nCan't create field "${field.name}"`, e, debug);
      }
    }
  }
};
