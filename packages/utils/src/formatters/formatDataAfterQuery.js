//@flow
import * as R from 'ramda';

import { getFieldSchemaByName, getTableSchemaByName } from '../selectors';
import { isRelationField, isListField } from '../verifiers';
import type { FieldSchema, TableSchema, Schema } from '../types';

/**
 * Remove unnecessary data after fetch entity data by query
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 */
const formatDataAfterQuery = (tableName: string, data: Object, schema: Schema) => {
  const tableSchema: ?TableSchema = getTableSchemaByName(tableName, schema);

  if (!tableSchema) {
    throw new Error(`Table schema with ${tableName} name not found in schema.`);
  }

  const formatedData = R.reduce((result: Object, fieldName: string) => {
    const fieldSchema: ?FieldSchema = getFieldSchemaByName(fieldName, tableSchema);

    if (!fieldSchema) {
      return result;
    }

    if (isRelationField(fieldSchema) && isListField(fieldSchema)) {
      if (data[fieldName]) {
        result = R.assoc(fieldName, data[fieldName].items, result);
      }
    } else {
      result = R.assoc(fieldName, data[fieldName], result);
    }

    return result;
  }, {}, R.keys(data));

  return formatedData;
};

export { formatDataAfterQuery };
