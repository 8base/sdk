import * as R from 'ramda';

import { tableSelectors, getTableSchemaByName, getTableSchemaById } from '../selectors';
import { isRelationField, isFileField, isListField, isMetaField } from '../verifiers';
import { Schema, FormatDataAfterQueryOptions } from '../types';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';

/**
 * Remove unnecessary data after fetch entity data by query
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 * @param {FormatDataAfterQueryOptions} options
 */
const formatDataAfterQuery = (
  tableName: string,
  data: { [key: string]: any },
  schema: Schema,
  options: FormatDataAfterQueryOptions = {},
) => {
  const tableSchema = getTableSchemaByName(schema, tableName);

  if (!tableSchema) {
    throw new SDKError(
      ERROR_CODES.TABLE_NOT_FOUND,
      PACKAGES.UTILS,
      `Table schema with ${tableName} name not found in schema.`,
    );
  }

  const formatedData = R.reduce(
    (result: { [key: string]: any }, fieldName: string) => {
      const fieldSchema = tableSelectors.getFieldByName(tableSchema, fieldName);

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
            result = R.assoc(
              fieldName,
              result[fieldName].map && result[fieldName].map(({ id }: { id: string }) => id),
              result,
            );
          } else {
            result = R.assoc(fieldName, result[fieldName].id, result);
          }
        } else {
          const refTableId = fieldSchema.relation && fieldSchema.relation.refTable.id;
          const relationTableSchema = getTableSchemaById(schema, refTableId || '');

          if (!relationTableSchema) {
            throw new SDKError(
              ERROR_CODES.TABLE_NOT_FOUND,
              PACKAGES.UTILS,
              `Relation table schema with ${refTableId} id not found in schema.`,
            );
          }

          if (isListField(fieldSchema)) {
            result[fieldName] = result[fieldName].map((item: any) =>
              formatDataAfterQuery(relationTableSchema.name, item, schema),
            );
          } else {
            result[fieldName] = formatDataAfterQuery(relationTableSchema.name, result[fieldName], schema);
          }
        }
      }

      return result;
    },
    {},
    R.keys(data) as string[],
  );

  return formatedData;
};

export { formatDataAfterQuery };
