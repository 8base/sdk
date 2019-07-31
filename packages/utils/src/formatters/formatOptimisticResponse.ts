import * as R from 'ramda';
import { SchemaNameGenerator } from '@8base/schema-name-generator';

import { MUTATION_TYPE, FIELD_TYPE } from '../constants';
import { tableSelectors, tableFieldSelectors, tablesListSelectors } from '../selectors';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';
import { MutationType, FieldSchema, TableSchema, Schema } from '../types';

interface IOptions {
  skip?: boolean | ((...args: any[]) => boolean);
}

// tslint:disable-next-line:interface-name
interface IformatOptimisticResponseMeta {
  tableName: string;
  appName?: string;
  schema: Schema;
}

const formatFileOptimisticResponse = (recordId: string, requestFieldData: any, fieldSchema: FieldSchema | void) => {
  const isList = tableFieldSelectors.isListField(fieldSchema);

  const fieldOptimisticResponse = isList
    ? {
        items: [
          ...requestFieldData
            .filter((fileItem: any) => !!fileItem.id)
            .map((fileItem: any) => ({
              __typename: 'File',
              ...fileItem,
            })),
          ...requestFieldData
            .filter((fileItem: any) => !fileItem.id)
            .map((fileItem: any, index: number) => ({
              __typename: 'File',
              id: `__optimistic_id_${recordId}_${index}__`,
              shareUrl: '__optimistic_value__',
              meta: {},
              downloadUrl: fileItem.downloadUrl,
              fileId: fileItem.fileId,
              filename: fileItem.filename,
            })),
        ],
        count: requestFieldData.length,
        __typename: 'FileListResponse',
      }
    : {
        __typename: 'File',
        id: '__optimistic_id__',
        shareUrl: '__optimistic_value__',
        meta: {},
        downloadUrl: requestFieldData.downloadUrl,
        fileId: requestFieldData.fileId,
        filename: requestFieldData.filename,
      };

  return fieldOptimisticResponse;
};

/**
 * Formats entity data for create or update mutation based on passed schema.
 * @param {MutationType} type - The type of the mutation.
 * @param {Object} requestData - The entity data to request.
 * @param {Object} schema - The schema of the used tables from the 8base API.
 */
const formatOptimisticResponse = (
  type: MutationType,
  { requestData, recordId }: any,
  { tableName, appName, schema }: IformatOptimisticResponseMeta,
  options: IOptions = {},
) => {
  if (R.not(type in MUTATION_TYPE)) {
    throw new SDKError(ERROR_CODES.INVALID_ARGUMENT, PACKAGES.UTILS, `Invalid mutation type: ${type}.`);
  }

  if (R.equals(type, 'CREATE')) {
    throw new SDKError(ERROR_CODES.NOT_IMPLEMENTED, PACKAGES.UTILS, `${type} mutation type is not supported yet.`);
  }

  if (R.isNil(requestData)) {
    return requestData;
  }

  const tableSchema = tablesListSelectors.getTableByName(schema, tableName, appName);

  if (!tableSchema) {
    throw new SDKError(
      ERROR_CODES.TABLE_NOT_FOUND,
      PACKAGES.UTILS,
      `Table schema with ${tableName} name is not found in schema.`,
    );
  }

  const formattedRepose = R.reduce(
    (result: { [key: string]: any }, fieldName: string) => {
      const fieldSchema = tableSelectors.getFieldByName(tableSchema, fieldName);
      const fieldType = tableFieldSelectors.getFieldType(fieldSchema);
      const tableName = tableFieldSelectors.getTableName(fieldSchema);

      const { skip } = options;

      if (typeof skip === 'function' && skip(requestData[fieldName], fieldSchema)) {
        return result;
      }

      const requestFieldData = requestData[fieldName];

      let fieldOptimisticResponse = {};

      if (fieldType === FIELD_TYPE.FILE) {
        fieldOptimisticResponse = formatFileOptimisticResponse(recordId, requestFieldData, fieldSchema);
      } else {
        // tslint:disable-next-line:no-console
        console.warn(`${fieldType} is not supported for optimistic response. ${fieldName} field will be ignored.`);

        return result;
      }

      return {
        ...result,
        [fieldName]: fieldOptimisticResponse,
      };
    },
    {},
    R.keys(requestData) as string[],
  );

  return {
    __typename: 'Mutation',
    [SchemaNameGenerator.getUpdateItemFieldName(tableName)]: {
      __typename: SchemaNameGenerator.getUpdateInputName(tableName).replace('UpdateInput', ''),
      id: recordId,
      ...formattedRepose,
    },
  };
};

export { formatOptimisticResponse };
