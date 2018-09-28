//@flow
import * as R from 'ramda';

import { MUTATION_TYPE } from '../constants';
import { getFieldSchemaByName, getTableSchemaByName } from '../selectors';
import { isMetaField } from '../verifiers';
import { formatFieldDataForMutation } from './formatFieldDataForMutation';
import type { MutationType, FieldSchema, TableSchema, Schema } from '../types';

/**
 * Formats entity data for create or update mutation based on passed schema.
 * @param {MutationType} type - The type of the mutation.
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 */
const formatDataForMutation = (type: MutationType, tableName: string, data: Object, schema: Schema) => {
  if (R.not(type in MUTATION_TYPE)) {
    throw new Error(`Invalid mutation type: ${type}`);
  }

  const tableSchema: ?TableSchema = getTableSchemaByName(tableName, schema);

  if (!tableSchema) {
    throw new Error(`Table schema with ${tableName} name not found in schema.`);
  }

  const formatedData = R.reduce((result: Object, fieldName: string) => {
    if (fieldName === '_description' || fieldName === '__typename') {
      return result;
    }

    const fieldSchema: ?FieldSchema = getFieldSchemaByName(fieldName, tableSchema);

    if (!fieldSchema) {
      throw new Error(`Field schema with ${fieldName} name not found in table schema with ${tableSchema.name} name.`);
    }

    if (isMetaField(fieldSchema)) {
      return result;
    }

    return {
      ...result,
      [fieldName]: formatFieldDataForMutation(type, fieldSchema, data[fieldName], schema),
    };
  }, {}, R.keys(data));

  return formatedData;
};

export { formatDataForMutation };
