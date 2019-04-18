import * as R from 'ramda';
import errorCodes from '@8base/error-codes';
import { Schema, FieldSchema } from '@8base/utils';
import { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, TABLE_CREATE_MUTATION, FIELD_CREATE_MUTATION } from './constants';
import { SchemaResponse } from './types';

type ImportTablesOptions = {
  debug?: boolean;
};

const handleError = (message: string, e: { response: any }, debug: boolean) => {
  // tslint:disable-next-line no-console
  console.warn(message);

  if (debug) {
    // tslint:disable-next-line no-console
    console.warn(JSON.stringify(e.response, null, 2));
  } else if (R.pathEq(['response', 'errors', 0, 'code'], errorCodes.ValidationErrorCode, e)) {
    // tslint:disable-next-line no-console
    console.warn(JSON.stringify(R.path(['response', 'errors', 0, 'details'], e), null, 2));
  } else {
    // tslint:disable-next-line no-console
    console.warn(R.path(['response', 'errors', 0, 'message'], e));
  }
};

export const importTables = async (
  request: <T extends object>(query: string | DocumentNode, variables?: object) => Promise<T>,
  schema: Schema,
  options: ImportTablesOptions = {},
) => {
  const debug: boolean = R.propOr(false, 'debug', options);

  for (const table of schema) {
    try {
      await request(TABLE_CREATE_MUTATION, {
        data: {
          displayName: table.displayName,
          name: table.name,
        },
      });
    } catch (e) {
      handleError(`\nCan't create table "${table.name}"`, e, debug);
    }
  }

  const tablesListData = await request<SchemaResponse>(TABLES_LIST_QUERY, {
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

      const field: Partial<FieldSchema> = R.pick(
        [
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
        ],
        schemaField,
      );

      if (field.fieldTypeAttributes) {
        field.fieldTypeAttributes = R.pick(
          [
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
          ],
          field.fieldTypeAttributes,
        );
      }

      if (field.relation && field.relation.refTable.name) {
        const refTableName = field.relation.refTable.name;

        const refTable = tablesByName[refTableName];

        // @ts-ignore. Check what does do relations prop.
        if (refTable.relations && refTable.relations[schemaTable.name]) {
          // @ts-ignore. Check what does do relations prop.
          if (refTable.relations[schemaTable.name].includes(field.name)) {
            continue;
          }
        }

        field.relation = {
          ...R.pick(['refFieldIsList', 'refFieldIsRequired', 'refFieldName', 'refFieldDisplayName'], field.relation),
          refTableId: refTable.id,
        } as any;

        // @ts-ignore. Check what does relations prop do.
        table.relations = table.relations || {};

        // @ts-ignore. Check what does relations prop do.
        if (table.relations[refTableName]) {
          // @ts-ignore. Check what does relations prop do.
          table.relations[refTableName].push(field.relation.refFieldName);
        } else {
          // @ts-ignore. Check what does relations prop do.
          table.relations[refTableName] = [field.relation.refFieldName];
        }
      }

      // @ts-ignore. Check what does tableId prop do.
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
