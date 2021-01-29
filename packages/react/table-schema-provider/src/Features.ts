import { propOr, pathOr } from 'ramda';
import { TableSchema, tablesListSelectors, tableSelectors, tableFieldSelectors, FIELD_TYPE } from '@8base/utils';

type IsTableFeaturesAllowedCommonArgs = {
  tableName?: string;
  appName?: string;
  tableId?: string;
};

type IsFieldFeaturesAllowedCommonArgs = {
  tableName?: string;
  appName?: string;
  fieldName: string;
  tableId?: string;
  fieldId?: string;
};

const getFieldSchemaFeatures = (
  { tableName, appName, fieldName, tableId, fieldId }: IsFieldFeaturesAllowedCommonArgs,
  tablesList: TableSchema[],
) => {
  if (!!tableId && !!fieldId) {
    const table = tablesListSelectors.getTableById(tablesList, tableId);
    const field = tableSelectors.getFieldById(table, fieldId);
    return tableFieldSelectors.getSchemaFeatures(field);
  } else if (!!tableName && !!fieldName) {
    const table = tablesListSelectors.getTableByName(tablesList, tableName, appName);
    const field = tableSelectors.getFieldByName(table, fieldName);
    return tableFieldSelectors.getSchemaFeatures(field);
  }

  return {};
};

const getFieldDataFeatures = (
  { tableName, appName, fieldName, tableId, fieldId }: IsFieldFeaturesAllowedCommonArgs,
  tablesList: TableSchema[],
) => {
  if (!!tableId && !!fieldId) {
    const table = tablesListSelectors.getTableById(tablesList, tableId);
    const field = tableSelectors.getFieldById(table, fieldId);
    return tableFieldSelectors.getDataFeatures(field);
  } else if (!!tableName && !!fieldName) {
    const table = tablesListSelectors.getTableByName(tablesList, tableName, appName);
    const field = tableSelectors.getFieldByName(table, fieldName);
    return tableFieldSelectors.getDataFeatures(field);
  }

  return {};
};

const getTableSchemaFeatures = (
  { tableName, appName, tableId }: IsTableFeaturesAllowedCommonArgs,
  tablesList: TableSchema[],
) => {
  if (!!tableId) {
    const table = tablesListSelectors.getTableById(tablesList, tableId);
    return tableSelectors.getSchemaFeatures(table);
  } else if (!!tableName) {
    const table = tablesListSelectors.getTableByName(tablesList, tableName, appName);
    return tableSelectors.getSchemaFeatures(table);
  }

  return {};
};

const getTableDataFeatures = (
  { tableName, appName, tableId }: IsTableFeaturesAllowedCommonArgs,
  tablesList: TableSchema[],
) => {
  if (!!tableId) {
    const table = tablesListSelectors.getTableById(tablesList, tableId);
    return tableSelectors.getDataFeatures(table);
  } else if (!!tableName) {
    const table = tablesListSelectors.getTableByName(tablesList, tableName, appName);
    return tableSelectors.getDataFeatures(table);
  }

  return {};
};

const Features = {
  schema: {
    isUpdateTableAllowed: (
      { tableName, appName, tableId, fieldName }: IsTableFeaturesAllowedCommonArgs & { fieldName: string },
      tablesList: TableSchema[],
    ) => {
      const schemaFeatures = getTableSchemaFeatures({ tableName, appName, tableId }, tablesList);

      return pathOr(false, ['update', fieldName], schemaFeatures);
    },

    isCreateFieldByTypeAllowed: (
      { tableName, appName, tableId, fieldType }: IsTableFeaturesAllowedCommonArgs & { fieldType: string },
      tablesList: TableSchema[],
    ) => {
      const schemaFeatures = getTableSchemaFeatures({ tableName, appName, tableId }, tablesList);

      return pathOr(false, ['create', fieldType], schemaFeatures);
    },

    isCreateFieldAllowed: (
      { tableName, appName, tableId }: IsTableFeaturesAllowedCommonArgs,
      tablesList: TableSchema[],
    ) => {
      return Object.keys(FIELD_TYPE).reduce(
        (result, fieldType) =>
          result || Features.schema.isCreateFieldByTypeAllowed({ tableName, appName, tableId, fieldType }, tablesList),
        false,
      );
    },

    isUpdateFieldAllowed: (options: IsFieldFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const schemaFeatures = getFieldSchemaFeatures(options, tablesList);

      return propOr(false, 'update', schemaFeatures);
    },

    isDeleteFieldAllowed: (options: IsFieldFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const schemaFeatures = getFieldSchemaFeatures(options, tablesList);

      return propOr(false, 'delete', schemaFeatures);
    },
  },

  data: {
    isCreateRecordAllowed: (options: IsTableFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const dataFeatures = getTableDataFeatures(options, tablesList);

      return propOr(false, 'create', dataFeatures);
    },

    isUpdateRecordAllowed: (options: IsTableFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const dataFeatures = getTableDataFeatures(options, tablesList);

      return propOr(false, 'update', dataFeatures);
    },

    isDeleteRecordAllowed: (options: IsTableFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const dataFeatures = getTableDataFeatures(options, tablesList);

      return propOr(false, 'delete', dataFeatures);
    },

    isCreateFieldAllowed: (options: IsFieldFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const dataFeatures = getFieldDataFeatures(options, tablesList);

      return propOr(false, 'create', dataFeatures);
    },

    isUpdateFieldAllowed: (options: IsFieldFeaturesAllowedCommonArgs, tablesList: TableSchema[]) => {
      const dataFeatures = getFieldDataFeatures(options, tablesList);

      return propOr(false, 'update', dataFeatures);
    },
  },
};

export { Features };
