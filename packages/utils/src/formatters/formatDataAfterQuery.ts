import * as R from 'ramda';

import { getFieldSchemaByName, getTableSchemaByName, getTableSchemaById } from '../selectors';
import {
  isRelationField,
  isFileField,
  isListField,
  isMetaField,
} from '../verifiers';

import { TableSchema, Schema, FormatDataAfterQueryOptions } from '../types';

/**
 * Remove unnecessary data after fetch entity data by query
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 * @param {FormatDataAfterQueryOptions} options
 */
const formatDataAfterQuery = (tableName: string, data: { [key: string]: any }, schema: Schema, options: FormatDataAfterQueryOptions = {}) => {
  const tableSchema = getTableSchemaByName(tableName, schema);

  if (!tableSchema) {
    throw new Error(`Table schema with ${tableName} name not found in schema.`);
  }

  const formatedData = R.reduce((result: { [key: string]: any }, fieldName: string) => {
    const fieldSchema = getFieldSchemaByName(fieldName, tableSchema);

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
      if (options.formatRelationToIds) {
        if (isListField(fieldSchema)) {
          result = R.assoc(fieldName, result[fieldName].map && result[fieldName].map(({ id }: { id: string }) => id), result);
        } else {
          result = R.assoc(fieldName, result[fieldName].id, result);
        }
      } else {
        const relationTableSchema = getTableSchemaById(fieldSchema.relation.refTable.id, schema);

        if (!relationTableSchema) {
          throw new Error(`Relation table schema with ${fieldSchema.relation.refTable.id} id not found in schema.`);
        }

        if (isListField(fieldSchema)) {
          result[fieldName] = result[fieldName].map((item: any) => formatDataAfterQuery(relationTableSchema.name, item, schema));
        } else {
          result[fieldName] = formatDataAfterQuery(relationTableSchema.name, result[fieldName], schema);
        }
      }
    }

    return result;
  }, {}, R.keys(data) as string[]);

  return formatedData;
};

export { formatDataAfterQuery };
