import * as path from 'path';
import * as https from 'https';
import * as fs from 'fs-extra';
import * as R from 'ramda';
import { DocumentNode } from 'graphql';
import { isFileField, isFilesTable, SYSTEM_TABLES, TableSchema } from '@8base/utils';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { TABLES_LIST_QUERY } from './constants';

type ExportDataConfig = {
  pathToSaveFiles?: string;
  tables?: {
    exclude?: string[];
    include?: string[];
  };
};

type Data = { [key: string]: any };

type TableSetting = {
  include?: string[];
  exclude?: string[];
  customFields?: { [key: string]: string };
  queryObject?: {
    name: string;
    query: string | ((body: string) => string);
  };
};

type TablesSettings = {
  [key: string]: TableSetting | undefined;
};

const DEFAULT_CONFIG = {
  pathToSaveFiles: path.resolve(__dirname, 'exported', 'files'),
  tables: {
    exclude: ['Settings', 'Permissions'],
  },
};

const TABLES_SETTINGS: TablesSettings = {
  Files: {
    include: ['id', 'downloadUrl', 'filename', 'public', 'meta', 'mods'],
  },
  Users: {
    exclude: ['permissions'],
  },
  Roles: {
    customFields: {
      permissions: `
        items {
          appId
          resourceType
          resource
          permission
        }
      `,
    },
  },
  AuthenticationSettings: {
    exclude: ['connections'],
    queryObject: {
      name: 'authenticationSettings',
      query: fields => `
        query AuthenticationSettings {
          authenticationSettings {
            ${fields}
            connections {
              google {
                enabled
                client_id
                client_secret
              }
              facebook {
                enabled
                app_id
                app_secret
              }
              github {
                enabled
                client_id
                client_secret
              }
            }
          }
        }
      `,
    },
  },
};

/**
 * (MUTATES passed object) Changes keys of object with preset depth
 * @param transformMap - object in format { 'oldKey': 'newKey' }
 * @param depth - how deep it should change keys
 * @param obj - target object
 */
function changeKeysName(transformMap: any, depth: number, obj: any) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    if (depth > 1) {
      if (obj[key] instanceof Array) {
        for (const item of obj[key]) {
          changeKeysName(transformMap, depth - 1, item);
        }
      } else {
        changeKeysName(transformMap, depth - 1, obj[key]);
      }
    }

    if (!transformMap.hasOwnProperty(key)) {
      continue;
    }

    const newKey = transformMap[key];
    Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, key)!);
    delete obj[key];
  }
}

function changeKeysNameInList(transformMap: Object, depth: number, list: any[]) {
  for (const item of list) {
    changeKeysName(transformMap, depth, item);
  }
}

/**
 * Saves locally non-public files in order to be able to import them in the future
 */
function workWithFiles(files: any[], pathToSave: string) {
  const promises = [];
  let isFolderCreated = false;

  for (const file of files) {
    changeKeysName({ downloadUrl: 'url' }, 1, file);

    if (!file.public && file.filename && file.filename.length > 0) {
      if (!isFolderCreated) {
        if (fs.existsSync(pathToSave)) {
          fs.removeSync(pathToSave);
        }

        fs.mkdirpSync(pathToSave);
        isFolderCreated = true;
      }

      const filePath = path.join(pathToSave, file.filename);
      const fileStream = fs.createWriteStream(filePath);

      promises.push(
        new Promise((resolve, reject) => {
          https
            .get(file.url, response => {
              response.pipe(fileStream);
              file.url = path.resolve(filePath);
              resolve();
            })
            .on('error', () => {
              fs.unlinkSync(filePath);
              reject();
            });
        }),
      );
    }
  }

  return Promise.all(promises);
}

/**
 * This function is util for Array.filter. It checks if [name] in [excludeList] or [includeList]
 */
function filterExcludeInclude(name?: any, excludeList?: any[], includeList?: any[]) {
  if (!name) {
    return false;
  }

  if (excludeList && excludeList.includes(name)) {
    return false;
  }

  if (includeList) {
    return includeList.includes(name);
  }

  return true;
}

/**
 * Checks table settings first and generates query object that has fields 'name' and 'query'.
 * We need the field 'name' in order to retrieve data from response.
 */
function getQueryObject(queryName: string, queryFields: string, tableName: string) {
  const tableSettings = TABLES_SETTINGS[tableName];
  const customQueryObject = tableSettings && tableSettings.queryObject;

  if (customQueryObject) {
    return {
      name: customQueryObject.name,
      query:
        typeof customQueryObject.query === 'function' ? customQueryObject.query(queryFields) : customQueryObject.query,
    };
  }

  return {
    name: queryName,
    query: `
      query ${tableName}List {
        ${queryName} {
          items {
            ${queryFields}
          }
        }
      }
    `,
  };
}

/**
 * (MUTATES passed object) Moves value of one field to another
 * @param obj
 * @param fields - fields that need transformation (move to)
 * @param fieldToMove - field that should be moved (move from)
 * @example
 *
 * moveField({
 *  { someField: { items: [1, 2] } }
 * }, ['someField'], 'items') // -> { { someField: [1, 2] } }
 */
function moveField(obj: any, fields: any[], fieldToMove: any) {
  for (const field of fields) {
    if (obj[field][fieldToMove]) {
      obj[field] = obj[field][fieldToMove];
    }
  }
}

/**
 * Exports data from workspace from provided tables.
 * If workspace has private files it will save them in specified folder.
 * @param request - function that will be used for requests
 * @param tablesSchema - schema of tables
 * @param config - config accept 'pathToSaveFiles' and 'ignoredTables' keys
 */
export const exportData = async (
  request: (query: string | DocumentNode, variables?: any) => Promise<any>,
  tablesSchema: TableSchema[],
  config?: ExportDataConfig,
) => {
  const data: Data = {};
  const finalConfig = R.mergeDeepLeft(config, DEFAULT_CONFIG) as ExportDataConfig & typeof DEFAULT_CONFIG;

  // Ensures that we have File table schema
  if (!tablesSchema.some(schema => schema.name === SYSTEM_TABLES.FILES)) {
    const filesSchemaTable = await request(TABLES_LIST_QUERY, {
      filter: { tableNames: [SYSTEM_TABLES.FILES] },
    });

    if (filesSchemaTable && R.hasPath(['tablesList', 'items'], filesSchemaTable)) {
      tablesSchema = [...tablesSchema, ...filesSchemaTable.tablesList.items];
    }
  }

  tablesSchema = tablesSchema.filter(({ name }) =>
    filterExcludeInclude(name, finalConfig.tables.exclude, finalConfig.tables.include),
  );

  for (const table of tablesSchema) {
    const listFields: string[] = [];
    const { name: tableName } = table;
    const tableSettings = TABLES_SETTINGS[tableName];
    let fields = table.fields;
    let queryFields = '';

    if (tableSettings && (tableSettings.include || tableSettings.exclude)) {
      fields = fields.filter(item => filterExcludeInclude(item.name, tableSettings.exclude, tableSettings.include));
    }

    for (const field of fields) {
      if (!field.name) {
        continue;
      }

      if (tableSettings && R.hasPath(['customFields', field.name], tableSettings)) {
        queryFields = `
          ${queryFields}${field.name} {
            ${tableSettings.customFields![field.name]}
          }\n`;
        continue;
      }

      if (!field.relation && !isFileField(field)) {
        queryFields = `${queryFields}${field.name}\n`;
      } else {
        if (field.isList) {
          listFields.push(field.name);
          queryFields = `
            ${queryFields}${field.name} {
              items {
                id
              }
            }\n`;
        } else {
          queryFields = `
            ${queryFields}${field.name} {
              id
            }\n`;
        }
      }
    }

    const queryFieldName = SchemaNameGenerator.getTableListFieldName(tableName);
    const { query, name: queryName } = getQueryObject(queryFieldName, queryFields, tableName);

    const response = await request(query);

    if (response && response[queryName]) {
      const responseData = response[queryName];
      const items = responseData.items;

      // Changes list field: { items: ['c'] } to ['c']
      if (listFields.length > 0 && Array.isArray(items)) {
        for (const item of items) {
          moveField(item, listFields, 'items');
        }
      } else {
        moveField(responseData, listFields, 'items');
      }

      data[tableName] = items || responseData;

      if (Array.isArray(data[tableName])) {
        changeKeysNameInList({ id: '$id' }, 3, data[tableName]);
      } else {
        changeKeysName({ id: '$id' }, 3, data[tableName]);
      }

      if (isFilesTable(table)) {
        await workWithFiles(data[tableName], finalConfig.pathToSaveFiles);
      }
    }
  }

  return data;
};
