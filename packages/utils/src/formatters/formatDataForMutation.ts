import * as R from 'ramda';

import { MUTATION_TYPE, MUTATION_FILE_FIELDS } from '../constants';
import { tableSelectors, tablesListSelectors } from '../selectors';
import { isMetaField, isFileField, isRelationField, isListField, isFilesTable } from '../verifiers';
import { formatFieldDataForMutation } from './formatFieldDataForMutation';
import { omitDeep } from './omitDeep';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';
import { MutationType, FieldSchema, TableSchema, Schema } from '../types';

interface IOptions {
  skip?: boolean | ((...args: any[]) => boolean);
  mutate?: (...args: any[]) => any;
  ignoreNonTableFields?: boolean;
}

interface IFormatDataForMutationMeta {
  tableName: string;
  appName?: string;
  schema: Schema;
}

/**
 * Formats entity data for create or update mutation based on passed schema.
 * @param {MutationType} type - The type of the mutation.
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 */
const formatDataForMutation = (
  type: MutationType,
  data: any,
  { tableName, appName, schema }: IFormatDataForMutationMeta,
  options: IOptions = {},
) => {
  if (R.not(type in MUTATION_TYPE)) {
    throw new SDKError(ERROR_CODES.INVALID_ARGUMENT, PACKAGES.UTILS, `Invalid mutation type: ${type}`);
  }

  if (R.isNil(data)) {
    return data;
  }

  const tableSchema = tablesListSelectors.getTableByName(schema, tableName, appName);

  if (!tableSchema) {
    throw new SDKError(
      ERROR_CODES.TABLE_NOT_FOUND,
      PACKAGES.UTILS,
      `Table schema with ${tableName} name not found in schema.`,
    );
  }

  const formatedData = R.reduce(
    (result: { [key: string]: any }, fieldName: string) => {
      if (
        fieldName === '_description' ||
        fieldName === '__typename' ||
        (isFilesTable(tableSchema) && !MUTATION_FILE_FIELDS.includes(fieldName))
      ) {
        return result;
      }

      const fieldSchema = tableSelectors.getFieldByName(tableSchema, fieldName);
      const { skip, mutate, ignoreNonTableFields = true } = options;

      if (!fieldSchema) {
        if (ignoreNonTableFields) {
          return result;
        }

        return { ...result, [fieldName]: data[fieldName] };
      }

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

      formatedFieldData = formatFieldDataForMutation(type, formatedFieldData, { fieldSchema, schema });

      if (typeof mutate === 'function') {
        formatedFieldData = mutate(formatedFieldData, data[fieldName], fieldSchema);
      }

      return {
        ...result,
        [fieldName]: formatedFieldData,
      };
    },
    {},
    R.keys(data) as string[],
  );

  return omitDeep(['_description', '__typename'], formatedData);
};

export { formatDataForMutation };
