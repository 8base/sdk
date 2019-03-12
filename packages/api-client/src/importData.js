// @flow
import { formatDataForMutation, isRelationField, getFieldSchemaByName, getTableSchemaByName, isFileField, isListField, MUTATION_TYPE } from '@8base/utils';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import * as filestack from 'filestack-js';
import * as R from 'ramda';
import type { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, USER_QUERY, FILE_UPLOAD_INFO_QUERY } from './constants';

const getRemoteEntityId = (localData: Object, fieldSchema: Object, $id: string, userId: string) => {
  let id = null;

  if ($id === '$currentUserId' && fieldSchema.relation.refTable.name === 'Users') {
    id = userId;
  } else {
    ({ id } = localData[fieldSchema.relation.refTable.name][$id]);
  }

  return id;
};

const MAX_PARALLEL_CREATIONS = 50;

const uploadFiles = async (record, tableSchema, filestackClient, path) => {
  const fieldNames = R.keys(record);

  let nextRecord = record;

  for (let i = fieldNames.length - 1; i >= 0; i--) {
    const fieldName = fieldNames[i];

    const fieldSchema = getFieldSchemaByName(fieldName, tableSchema);

    if (fieldSchema && isFileField(fieldSchema)) {
      if (isListField(fieldSchema)) {
        if (Array.isArray(record[fieldName])) {
          for (let j = 0; j < record[fieldName].length; j++) {
            nextRecord = R.assocPath([fieldName, j, 'fileId'], (await (filestackClient.storeURL(record[fieldName][j].url, {
              path,
            }))).handle, nextRecord);
            nextRecord = R.dissocPath([fieldName, j, 'url'], nextRecord);
          }
        }
      } else {
        if (record[fieldName]) {
          nextRecord = R.assocPath([fieldName, 'fileId'], (await (filestackClient.storeURL(record[fieldName].url, {
            path,
          }))).handle, nextRecord);
          nextRecord = R.dissocPath([fieldName, 'url'], nextRecord);
        }
      }
    }
  }

  return nextRecord;
};

export const importData = async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>, schemaData: Object) => {
  const { tablesList: { items: tableSchema }} = await request(TABLES_LIST_QUERY, {
    filter: {
      onlyUserTables: false,
    },
  });

  let fileUploadInfo = {};

  try {
    ({ fileUploadInfo } = await request(FILE_UPLOAD_INFO_QUERY));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Can\'t fetch file upload info', e);
  }

  const filestackClient = filestack.init(fileUploadInfo.apiKey, {
    security: {
      policy: fileUploadInfo.policy,
      signature: fileUploadInfo.signature,
    },
  });

  const localData = {};

  for (const tableName of Object.keys(schemaData)) {
    localData[tableName] = {};

    for (let i = 0; i < schemaData[tableName].length / MAX_PARALLEL_CREATIONS; i++) {
      const tempData = schemaData[tableName].slice(i * MAX_PARALLEL_CREATIONS, (i + 1) * MAX_PARALLEL_CREATIONS);

      await Promise.all(tempData.map(async (item) => {
        item = await uploadFiles(item, getTableSchemaByName(tableName, tableSchema), filestackClient, fileUploadInfo.path);

        const data = formatDataForMutation(MUTATION_TYPE.CREATE, tableName, item, tableSchema, {
          skip: (value, fieldSchema) => isRelationField(fieldSchema),
        });

        const fieldData = await request(`
          mutation create($data: ${SchemaNameGenerator.getCreateInputName(tableName)}!) {
            field: ${SchemaNameGenerator.getCreateItemFieldName(tableName)}(data: $data) {
              id
            }
          }
        `, {
          data,
        });

        if (item.$id) {
          localData[tableName][item.$id] = fieldData.field;
        }
      }));
    }
  }

  let userId = '';

  try {
    const userData = await request(USER_QUERY);

    userId = userData.user.id;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Can\'t fetch user info', e);
  }

  for (const tableName of Object.keys(schemaData)) {
    for (const item of schemaData[tableName]) {
      const data = formatDataForMutation(MUTATION_TYPE.UPDATE, tableName, item, tableSchema, {
        skip: (value, fieldSchema) => !isRelationField(fieldSchema),
        mutate: (value, plainValue, fieldSchema) => {
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

          return { connect: { id }};
        },
      });

      await request(`
        mutation update($data: ${SchemaNameGenerator.getUpdateInputName(tableName)}!) {
          field: ${SchemaNameGenerator.getUpdateItemFieldName(tableName)}(data: $data) {
            id
          }
        }
      `, {
        data: {
          ...data,
          id: localData[tableName][item.$id].id,
        },
      });
    }
  }
};
