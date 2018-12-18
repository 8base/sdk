// @flow
import * as R from 'ramda';
import type { Schema } from '@8base/utils';
import type { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, TABLE_CREATE_MUTATION, FIELD_CREATE_MUTATION } from './constants';

export const importTables = async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>, schema: Schema) => {
  for (const table of schema) {
    try {
      await request(TABLE_CREATE_MUTATION, {
        data: {
          name: table.name,
          displayName: table.displayName,
        },
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Can't create table "${table.name}"`);
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
        // eslint-disable-next-line no-console
        console.warn(`Can't create field "${field.name}"`);
      }
    }
  }
};
