//@flow
import * as R from 'ramda';

import { MUTATION_TYPE } from '../constants';
import { getFieldSchemaByName, getTableSchemaByName } from '../selectors';
import { isMetaField, isFileField, isRelationField, isListField } from '../verifiers';
import { formatFieldDataForMutation } from './formatFieldDataForMutation';
import { omitDeep } from './omitDeep';

import type { MutationType, FieldSchema, TableSchema, Schema } from '../types';
/**

 * Formats entity data for create or update mutation based on passed schema.
 * @param {MutationType} type - The type of the mutation.
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 */
const formatDataForMutation = (type: MutationType, tableName: string, data: any, schema: Schema, options: Object = {}) => {
  if (R.not(type in MUTATION_TYPE)) {
    throw new Error(`Invalid mutation type: ${type}`);
  }

  if (R.isNil(data)) {
    return data;
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
      // throw new Error(`Field schema with ${fieldName} name not found in table schema with ${tableSchema.name} name.`);
      return result;
    }

    const { skip } = options;

    if (typeof skip === 'function' && skip(data[fieldName], fieldSchema)) {
      return result;
    }

    if (isMetaField(fieldSchema)) {
      return result;
    }

    let formatedFieldData = data[fieldName];

    if ((isFileField(fieldSchema) || isRelationField(fieldSchema)) && isListField(fieldSchema)) {
      if (R.isNil(formatedFieldData)) {
        formatedFieldData = [];
      } else {
        formatedFieldData = R.reject(R.isNil, formatedFieldData);
      }

      if (formatedFieldData.length === 0 && type === MUTATION_TYPE.CREATE) {
        return result;
      }
    }

    formatedFieldData = formatFieldDataForMutation(type, fieldSchema, formatedFieldData, schema);

    const { mutate } = options;

    if (typeof mutate === 'function') {
      formatedFieldData = mutate(formatedFieldData, data[fieldName], fieldSchema);
    }

    return {
      ...result,
      [fieldName]: formatedFieldData,
    };
  }, {}, R.keys(data));

  return omitDeep(['_description', '__typename'], formatedData);
};

export { formatDataForMutation };
