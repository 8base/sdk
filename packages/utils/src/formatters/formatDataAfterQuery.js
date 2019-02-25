//@flow
import * as R from 'ramda';

import { getFieldSchemaByName, getTableSchemaByName } from '../selectors';
import { isRelationField, isFileField, isListField, isMetaField } from '../verifiers';

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

    if ((isRelationField(fieldSchema) || isFileField(fieldSchema)) && isListField(fieldSchema)) {
      if (data[fieldName]) {
        result[fieldName] = data[fieldName].items;
      }
    } else if (!isMetaField(fieldSchema)) {
      result = R.assoc(fieldName, data[fieldName], result);
    }

    if (isRelationField(fieldSchema) && !isFileField(fieldSchema) && result[fieldName]) {
      if (isListField(fieldSchema)) {
        result = R.assoc(fieldName, result[fieldName].map && result[fieldName].map(({ id }) => id), result);
      } else {
        result = R.assoc(fieldName, result[fieldName].id, result);
      }
    }

    return result;
  }, {}, R.keys(data));

  return formatedData;
};

export { formatDataAfterQuery };
