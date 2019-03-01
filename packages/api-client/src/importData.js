// @flow
import { formatDataForMutation, isRelationField, MUTATION_TYPE } from '@8base/utils';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import type { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, USER_QUERY } from './constants';

const getRemoteEntityId = (localData: Object, fieldSchema: Object, $id: string, userId: string) => {
  let id = null;

  if ($id === '$currentUserId' && fieldSchema.relation.refTable.name === 'Users') {
    id = userId;
  } else {
    ({ id } = localData[fieldSchema.relation.refTable.name][$id]);
  }

  return id;
};

export const importData = async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>, schemaData: Object) => {
  const { tablesList: { items: tableSchema }} = await request(TABLES_LIST_QUERY, {
    filter: {
      onlyUserTables: false,
    },
  });

  const localData = {};

  for (const tableName of Object.keys(schemaData)) {
    localData[tableName] = {};

    for (const item of schemaData[tableName]) {
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
    }
  }

  const userData = await request(USER_QUERY);

  const userId = userData.user.id;

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
