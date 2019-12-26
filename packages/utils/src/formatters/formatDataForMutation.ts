import * as R from 'ramda';

import { MUTATION_TYPE, MUTATION_FILE_FIELDS, UPDATE_META_FIELDS_TO_PRESERVE } from '../constants';
import { tableSelectors, tablesListSelectors } from '../selectors';
import { isMetaField, isFileField, isRelationField, isListField, isFilesTable } from '../verifiers';
import { formatFieldDataForMutation } from './formatFieldDataForMutation';
import { omitDeep } from './omitDeep';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';
import { MutationType, Schema, FormatDataForMutationOptions } from '../types';

interface IFormatDataForMutationMeta {
  tableName: string;
  schema: Schema;
  appName?: string;
  initialData?: any;
}

const DEFAULT_OPTIONS: Partial<FormatDataForMutationOptions> = {
  ignoreNonTableFields: true,
};

const shouldPreserveMetaField = ({ type, fieldName }: { type: MutationType; fieldName: string }) => {
  return type !== MUTATION_TYPE.UPDATE ? false : UPDATE_META_FIELDS_TO_PRESERVE[fieldName];
};

/**
 * Formats entity data for create or update mutation based on passed schema.
 * @param {MutationType} type - The type of the mutation.
 * @param {string} tableName - The name of the table from the 8base API.
 * @param {Object} data - The entity data for format.
 * @param {Object} initialData - Initial data. Used in UPDATE on submit formatting to disconnect removed relations.
 * @param {Schema} schema - The schema of the used tables from the 8base API.
 */
const formatDataForMutation = (
  type: MutationType,
  data: any,
  { tableName, appName, schema, initialData }: IFormatDataForMutationMeta,
  options: FormatDataForMutationOptions = {},
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

  options = R.mergeDeepRight(DEFAULT_OPTIONS, options);

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
      const { skip, mutate, ignoreNonTableFields } = options;

      if (!fieldSchema) {
        if (ignoreNonTableFields) {
          return result;
        }

        return { ...result, [fieldName]: data[fieldName] };
      }

      if (typeof skip === 'function' && skip(data[fieldName], fieldSchema)) {
        return result;
      }

      if (isMetaField(fieldSchema) && !shouldPreserveMetaField({ type, fieldName })) {
        return result;
      }

      let formatedFieldData = data[fieldName];
      const initialFieldData = R.path([fieldName], initialData);

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

      formatedFieldData = formatFieldDataForMutation(
        type,
        formatedFieldData,
        {
          fieldSchema,
          schema,
          initialData: initialFieldData,
        },
        options,
      );

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
