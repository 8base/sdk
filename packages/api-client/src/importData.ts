import {
  getTableSchemaByName,
  tableFieldSelectors,
  tableSelectors,
  FieldSchema,
  TableSchema,
  SDKError,
  ERROR_CODES,
  PACKAGES,
  SYSTEM_TABLES,
  isFilesTable,
  Relation,
} from '@8base/utils';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import * as filestack from 'filestack-js';
import * as R from 'ramda';
import { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY, USER_QUERY, FILE_UPLOAD_INFO_QUERY } from './constants';
import { SchemaResponse, FileUploadInfoResponse, FilestackClient } from './types';

type ImportOptions = {
  tablesSchema?: TableSchema[];
};

type ConstructorOptions = {
  request: <T extends object>(query: string | DocumentNode, variables?: Object) => Promise<T>;
  data: Record<string, any>;
  tablesSchema: TableSchema[];
  currentUserId?: string;
  fileUploadInfo?: FileUploadInfoResponse;
};

const IGNORED_FIELDS = ['id', 'createdAt', 'createdBy', 'updatedAt'];

const isRelationFileField = (value: any, fieldSchema: FieldSchema) =>
  value && tableFieldSelectors.isFileField(fieldSchema)
    ? tableFieldSelectors.isListField(fieldSchema)
      ? value.some((item: any) => item.$id)
      : value.$id
    : false;

async function uploadOrStoreFile(url: string, path: string, filestackClient: FilestackClient) {
  return /\w+:\/\//.test(url)
    ? await filestackClient.storeURL(url, {
        path,
      })
    : await filestackClient.upload(
        url,
        {},
        {
          path,
        },
      );
}

async function uploadFiles(record: any, filestackClient: FilestackClient, path: string) {
  let nextRecord = record;

  if (record && record.url) {
    const { handle: id } = await uploadOrStoreFile(record.url, path, filestackClient);

    nextRecord = R.assoc('fileId', id, nextRecord);
    nextRecord = R.dissoc('url', nextRecord);

    return nextRecord;
  }

  if (Array.isArray(record)) {
    for (let i = 0, len = record.length; i < len; i++) {
      const item = record[i];

      if (!item || !item.url) {
        continue;
      }

      const { handle: id } = await uploadOrStoreFile(item.url, path, filestackClient);

      nextRecord = R.assocPath([i, 'fileId'], id, nextRecord);
      nextRecord = R.dissocPath([i, 'url'], nextRecord);
    }
  }

  return nextRecord;
}

function buildQueryFromTree(queryTree: any[], tableName: string) {
  return `
    mutation create($data: ${SchemaNameGenerator.getCreateInputName(tableName)}!) {
      remoteEntry: ${SchemaNameGenerator.getCreateItemFieldName(tableName)}(data: $data) {
        ${buildQueryFields(queryTree)}
      }
    }
  `;
}

function buildQueryFields(queryTree: any[]) {
  if (!Array.isArray(queryTree)) {
    return '';
  }

  let queryString = '';

  for (const branch of queryTree) {
    if (typeof branch === 'string') {
      queryString += branch + '\n';
    }

    if (Array.isArray(branch)) {
      queryString += `
        ${branch[0]} {
          ${buildQueryFields(branch[1])}
        }
      `;
    }
  }

  return queryString;
}

function mergeTrees(firstTree: any[], secondTree: any[]) {
  let newTree: any[] = [];
  let longestTree;
  let shortestTree;

  if (firstTree.length > secondTree.length) {
    longestTree = [...firstTree];
    shortestTree = [...secondTree];
  } else {
    longestTree = [...secondTree];
    shortestTree = [...firstTree];
  }

  for (const item of longestTree) {
    if (typeof item === 'string') {
      newTree = [...newTree, item];
      const indexInShortest = shortestTree.indexOf(item);

      if (indexInShortest !== -1) {
        shortestTree.splice(indexInShortest, 1);
      }
    }

    if (Array.isArray(item)) {
      const keyName = item[0];
      const foundItem = shortestTree.find(el => Array.isArray(el) && el[0] === keyName);

      if (foundItem) {
        newTree = [...newTree, [keyName, mergeTrees(foundItem[1], item[1])]];
      } else {
        newTree = [...newTree, item];
      }
    }
  }

  return newTree;
}

class DataImporter {
  private uploadedData: Record<string, Record<string, { id: string } | undefined> | undefined>;
  private busyEntries: Record<string, string[] | undefined>;
  private tablesSchema: TableSchema[];
  private data: Record<string, any>;
  private request: <T extends object>(query: string | DocumentNode, variables?: Object) => Promise<T>;
  private currentUserId?: string;
  private filestackClient?: FilestackClient;
  private fileUploadInfo?: FileUploadInfoResponse;

  constructor(options: ConstructorOptions) {
    this.uploadedData = {};
    this.busyEntries = {};
    this.data = options.data;
    this.request = options.request;
    this.tablesSchema = options.tablesSchema;
    this.currentUserId = options.currentUserId;
    this.fileUploadInfo = options.fileUploadInfo;

    if (this.fileUploadInfo) {
      this.filestackClient = filestack.init(this.fileUploadInfo.apiKey, {
        security: {
          policy: this.fileUploadInfo.policy,
          signature: this.fileUploadInfo.signature,
        },
      });
    }
  }

  public async import() {
    // We should start with Files first in order to connect them in the future
    const tables = Object.keys(this.data).sort((a, b) =>
      a === SYSTEM_TABLES.FILES ? -1 : b === SYSTEM_TABLES.FILES ? 1 : 0,
    );

    for (const tableName of tables) {
      const tableSchema = this.tablesSchema.find(schema => schema.name === tableName);

      if (!tableSchema) {
        throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.API_CLIENT, `Table with name ${tableName} not found`);
      }

      const entries = this.data[tableName];

      for (let entry of entries) {
        if (isFilesTable(tableSchema) && this.fileUploadInfo && this.filestackClient) {
          entry = await uploadFiles(entry, this.filestackClient, this.fileUploadInfo.path);
        }

        const workResult = await this.workWithEntry(entry, tableSchema);
        this.busyEntries = {};

        if (!workResult) {
          continue;
        }

        const query = buildQueryFromTree(workResult.queryTree, tableName);
        const { remoteEntry } = await this.request<{ remoteEntry: any }>(query, {
          data: workResult.mutationInput,
        });

        this.addToUploaded(workResult.relationMap, remoteEntry, tableSchema);
      }
    }
  }

  private async workWithEntry(entry: any, tableSchema: TableSchema, ignoredRelation?: string) {
    const tableName = tableSchema.name;

    if (
      !entry ||
      (Array.isArray(this.busyEntries[tableName]) && this.busyEntries[tableName]!.indexOf(entry.$id) !== -1) ||
      this.isUploaded(entry, tableName)
    ) {
      return false;
    }

    const relationMap: Record<string, any> = { $id: entry.$id };
    const mutationInput: Record<string, any> = {};
    const queryTree: any[] = ['id'];
    const fields = Object.keys(entry).filter(
      field => tableSchema.fields.find(item => item.name === field) && !IGNORED_FIELDS.includes(field),
    );

    this.busyEntries = R.mergeDeepWith(R.concat, this.busyEntries, { [tableName]: [entry.$id] });

    for (const fieldName of fields) {
      const fieldSchema = tableSelectors.getFieldByName(tableSchema, fieldName);
      const fieldValue = entry[fieldName];

      if (!fieldSchema || R.isNil(fieldValue)) {
        continue;
      }

      if (!tableFieldSelectors.isRelationField(fieldSchema) && !tableFieldSelectors.isFileField(fieldSchema)) {
        mutationInput[fieldName] = fieldValue;
        continue;
      }

      if (tableFieldSelectors.isFileField(fieldSchema)) {
        mutationInput[fieldName] = await this.workWithFileField(fieldValue, fieldSchema);
        continue;
      }

      const relation: Partial<Relation> = fieldSchema.relation || {};
      const refTableName = tableFieldSelectors.getRelationTableName(fieldSchema);
      const refTableSchema = getTableSchemaByName(this.tablesSchema, refTableName);
      const isListField = tableFieldSelectors.isListField(fieldSchema);
      const { relationTableName } = relation;
      const { isRequired } = fieldSchema;

      if (ignoredRelation === relationTableName) {
        continue;
      }

      if (!refTableSchema || !fieldValue) {
        if (isRequired) {
          return false;
        } else {
          continue;
        }
      }

      mutationInput[fieldName] = {
        create: [],
        connect: [],
      };

      relationMap[fieldName] = { items: [] };

      const relationsIds = Array.isArray(fieldValue) ? fieldValue.map(({ $id }) => $id) : [fieldValue.$id];
      const relationsQueryTrees = [];

      for (const relationId of relationsIds) {
        let newWorkResult;
        let shouldConnect = true;
        let relationEntry: any;

        if (relationId === '$currentUserId' && refTableName === SYSTEM_TABLES.USERS && this.currentUserId) {
          relationEntry = {
            id: this.currentUserId,
          };
        } else {
          relationEntry = this.uploadedData[refTableName] && this.uploadedData[refTableName]![relationId];
        }

        if (!relationEntry) {
          shouldConnect = false;
          relationEntry =
            this.data[refTableName] && this.data[refTableName].find((item: any) => item.$id === relationId);
          newWorkResult = await this.workWithEntry(relationEntry, refTableSchema, relationTableName);
          relationEntry = typeof newWorkResult === 'object' && newWorkResult.mutationInput;
        }

        if (!relationEntry) {
          if (isRequired) {
            this.busyEntries[tableName] = this.busyEntries[tableName]!.filter(id => id !== entry.$id);
            return false;
          }

          continue;
        }

        if (shouldConnect) {
          mutationInput[fieldName].connect.push(relationEntry);
        } else {
          mutationInput[fieldName].create.push(relationEntry);

          if (typeof newWorkResult === 'object') {
            relationMap[fieldName].items.push(newWorkResult.relationMap);
            relationsQueryTrees.push(newWorkResult.queryTree);
          }
        }
      }

      mutationInput[fieldName] = {
        create: isListField ? mutationInput[fieldName].create : mutationInput[fieldName].create[0],
        connect: isListField ? mutationInput[fieldName].connect : mutationInput[fieldName].connect[0],
      };

      relationMap[fieldName] = isListField ? relationMap[fieldName] : relationMap[fieldName].items[0];

      if (relationsQueryTrees.length > 0) {
        if (isListField) {
          const relationQueryTree = relationsQueryTrees.reduce(mergeTrees, []);
          queryTree.push([fieldName, [['items', relationQueryTree]]]);
        } else {
          queryTree.push([fieldName, relationsQueryTrees[0]]);
        }
      }
    }

    return { mutationInput, relationMap, queryTree };
  }

  private async workWithFileField(fieldValue: any, fieldSchema: FieldSchema) {
    if (isRelationFileField(fieldValue, fieldSchema)) {
      const uploadedFiles = this.uploadedData[SYSTEM_TABLES.FILES];

      if (!uploadedFiles) {
        return;
      }

      if (Array.isArray(fieldValue)) {
        return {
          connect: fieldValue.reduce((acc, currentValue = {}) => {
            const { $id } = currentValue;
            const uploadedFile = $id && uploadedFiles[$id];

            return uploadedFile && uploadedFile.id ? [...acc, { id: uploadedFile.id }] : acc;
          }, []),
        };
      }

      if (uploadedFiles[fieldValue.$id]) {
        return { connect: { id: uploadedFiles[fieldValue.$id]!.id } };
      }
    }

    if (this.filestackClient && this.fileUploadInfo && !R.isNil(fieldValue)) {
      const fileInput = await uploadFiles(fieldValue, this.filestackClient, this.fileUploadInfo.path);

      return {
        create: fileInput,
      };
    }
  }

  private isUploaded(entry: any, tableName: string) {
    return entry && this.uploadedData[tableName] && this.uploadedData[tableName]![entry.$id];
  }

  private addToUploaded(relationMap: any, remoteEntry: any, schema: TableSchema) {
    if (!remoteEntry || !relationMap) {
      return;
    }

    const keys = Object.keys(remoteEntry);

    for (const key of keys) {
      if (key === 'id' && relationMap.$id) {
        const { $id } = relationMap;

        if (!this.uploadedData[schema.name]) {
          this.uploadedData[schema.name] = {};
        }

        this.uploadedData[schema.name]![$id] = {
          id: remoteEntry.id,
        };

        continue;
      }

      if (!remoteEntry[key] || !relationMap[key]) {
        continue;
      }

      const fieldSchema = tableSelectors.getFieldByName(schema, key);
      const refTableName = fieldSchema && fieldSchema.relation && fieldSchema.relation.refTable.name;
      const refTableSchema = refTableName && getTableSchemaByName(this.tablesSchema, refTableName);
      const isListField = fieldSchema && tableFieldSelectors.isListField(fieldSchema);

      if (refTableSchema && refTableName && fieldSchema) {
        const remoteRelations = isListField ? remoteEntry[key].items : [remoteEntry[key]];
        const newRelationMap = isListField ? relationMap[key].items : [relationMap[key]];

        for (let i = 0, len = remoteRelations.length; i < len; i++) {
          this.addToUploaded(newRelationMap[i], remoteRelations[i], refTableSchema);
        }
      }
    }
  }
}

export const importData = async (
  request: <T extends any>(query: string | DocumentNode, variables?: Object) => Promise<T>,
  data: Record<string, any>,
  options: ImportOptions = {},
) => {
  let { tablesSchema } = options;
  let fileUploadInfo: any = {};
  let currentUserId: string | undefined;

  try {
    const { user } = await request<{ user: { id: string } }>(USER_QUERY);
    currentUserId = user.id;
  } catch (e) {
    // tslint:disable-next-line no-console
    console.log("Can't fetch user info", e);
  }

  try {
    ({ fileUploadInfo } = await request(FILE_UPLOAD_INFO_QUERY));
  } catch (e) {
    // tslint:disable-next-line no-console
    console.log("Can't fetch file upload info", e);
  }

  if (!tablesSchema) {
    const { tablesList } = await request<SchemaResponse>(TABLES_LIST_QUERY, {
      filter: {
        onlyUserTables: false,
      },
    });

    tablesSchema = tablesList.items;
  } else if (!tablesSchema.some(schema => schema.name === SYSTEM_TABLES.FILES)) {
    // Ensures that we have File table schema
    const filesSchemaTable = await request(TABLES_LIST_QUERY, {
      filter: { tableNames: [SYSTEM_TABLES.FILES] },
    });

    if (filesSchemaTable && R.hasPath(['tablesList', 'items'], filesSchemaTable)) {
      tablesSchema = [...tablesSchema, ...filesSchemaTable.tablesList.items];
    }
  }

  const importer = new DataImporter({ request, currentUserId, data, tablesSchema, fileUploadInfo });

  return await importer.import();
};
