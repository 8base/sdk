import {
  formatDataForMutation,
  tablesListSelectors,
  tableFieldSelectors,
  tableSelectors,
  MUTATION_TYPE,
  FieldSchema,
  TableSchema,
  SDKError,
  ERROR_CODES,
  PACKAGES,
} from '@8base/utils';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import * as filestack from 'filestack-js';
import * as R from 'ramda';
import { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, USER_QUERY, FILE_UPLOAD_INFO_QUERY } from './constants';
import { SchemaResponse } from './types';

const getRemoteEntityId = (
  localData: { [key: string]: any },
  fieldSchema: FieldSchema,
  $id: string,
  userId: string,
) => {
  let id = null;

  if ($id === '$currentUserId' && fieldSchema.relation.refTable.name === 'Users') {
    id = userId;
  } else {
    ({ id } = localData[fieldSchema.relation.refTable.name][$id]);
  }

  return id;
};

const MAX_THREADS = 5;

const uploadFiles = async (record: any, tableSchema: TableSchema, filestackClient: any, path: string) => {
  const fieldNames: string[] = R.keys(record) as any;

  let nextRecord = record;

  for (let i = fieldNames.length - 1; i >= 0; i--) {
    const fieldName = fieldNames[i];

    const fieldSchema = tableSelectors.getFieldByName(tableSchema, fieldName);

    if (fieldSchema && tableFieldSelectors.isFileField(fieldSchema)) {
      if (tableFieldSelectors.isListField(fieldSchema)) {
        if (Array.isArray(record[fieldName])) {
          for (let j = 0; j < record[fieldName].length; j++) {
            nextRecord = R.assocPath(
              [fieldName, j, 'fileId'],
              (await filestackClient.storeURL(record[fieldName][j].url, {
                path,
              })).handle,
              nextRecord,
            );
            nextRecord = R.dissocPath([fieldName, j, 'url'], nextRecord);
          }
        }
      } else {
        if (record[fieldName]) {
          nextRecord = R.assocPath(
            [fieldName, 'fileId'],
            (await filestackClient.storeURL(record[fieldName].url, {
              path,
            })).handle,
            nextRecord,
          );
          nextRecord = R.dissocPath([fieldName, 'url'], nextRecord);
        }
      }
    }
  }

  return nextRecord;
};

type ImportOptions = {
  maxThreads?: number;
};

export const importData = async (
  request: <T extends object>(query: string | DocumentNode, variables?: object) => Promise<T>,
  schemaData: { [key: string]: any },
  options: ImportOptions = {},
) => {
  const {
    tablesList: { items: schema },
  } = await request<SchemaResponse>(TABLES_LIST_QUERY, {
    filter: {
      onlyUserTables: false,
    },
  });

  let fileUploadInfo = {} as any;

  try {
    ({ fileUploadInfo } = await request(FILE_UPLOAD_INFO_QUERY));
  } catch (e) {
    // tslint:disable-next-line no-console
    console.log("Can't fetch file upload info", e);
  }

  const filestackClient = filestack.init(fileUploadInfo.apiKey, {
    security: {
      policy: fileUploadInfo.policy,
      signature: fileUploadInfo.signature,
    },
  });

  const localData = {} as any;

  const maxThreads: number = R.propOr(MAX_THREADS, 'maxThreads', options);

  for (const tableName of Object.keys(schemaData)) {
    localData[tableName] = {};

    const tableSchema = tablesListSelectors.getTableByName(schema, tableName);

    if (!tableSchema) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.API_CLIENT, `Table with name ${tableName} not found`);
    }

    for (let i = 0; i < schemaData[tableName].length / maxThreads; i++) {
      const tempData = schemaData[tableName].slice(i * maxThreads, (i + 1) * maxThreads);

      await Promise.all(
        tempData.map(async (item: any) => {
          item = await uploadFiles(item, tableSchema, filestackClient, fileUploadInfo.path);

          const data = formatDataForMutation({
            type: MUTATION_TYPE.CREATE,
            tableName,
            data: item,
            schema,
            options: {
              skip: (value: any, fieldSchema: FieldSchema) => tableFieldSelectors.isRelationField(fieldSchema),
            }
          });

          const fieldData = await request<{ field: { id: string } }>(
            `
          mutation create($data: ${SchemaNameGenerator.getCreateInputName(tableName)}!) {
            field: ${SchemaNameGenerator.getCreateItemFieldName(tableName)}(data: $data) {
              id
            }
          }
        `,
            {
              data,
            },
          );

          if (item.$id) {
            localData[tableName][item.$id] = fieldData.field;
          }
        }),
      );
    }
  }

  let userId = '';

  try {
    const userData = await request<{ user: { id: string } }>(USER_QUERY);

    userId = userData.user.id;
  } catch (e) {
    // tslint:disable-next-line no-console
    console.log(`Can't fetch user info`, e);
  }

  for (const tableName of Object.keys(schemaData)) {
    for (const item of schemaData[tableName]) {
      const data = formatDataForMutation({
        type: MUTATION_TYPE.UPDATE,
        tableName,
        data: item,
        schema,
        options: {
          mutate: (value: any, plainValue: any, fieldSchema: FieldSchema) => {
            if (Array.isArray(plainValue)) {
              return {
                connect: plainValue.map(({ $id }) => ({
                  id: getRemoteEntityId(localData, fieldSchema, $id, userId),
                })),
              };
            }

            if (!plainValue) {
              return null;
            }

            const id = getRemoteEntityId(localData, fieldSchema, plainValue.$id, userId);

            return { connect: { id } };
          },
          skip: (value: any, fieldSchema: FieldSchema) => !tableFieldSelectors.isRelationField(fieldSchema),
        }
      });

      await request(
        `
        mutation update($data: ${SchemaNameGenerator.getUpdateInputName(tableName)}!) {
          field: ${SchemaNameGenerator.getUpdateItemFieldName(tableName)}(data: $data) {
            id
          }
        }
      `,
        {
          data: {
            ...data,
            id: localData[tableName][item.$id].id,
          },
        },
      );
    }
  }
};
