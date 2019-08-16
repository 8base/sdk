import * as R from 'ramda';
import { TableSchema, FieldSchema, Application } from '../types';
import { createSelector, ParametricSelector } from 'reselect';

export const getTableList = (tables?: TableSchema[]) => tables || [];

export const getTableById: ParametricSelector<TableSchema[], string, TableSchema> = createSelector(
  getTableList,
  (_: any, tableId: string) => tableId,
  (tables, tableId): any => (tables && tables.find(({ id }) => id === tableId)) || {},
);

export const getTableByName: (
  schema: TableSchema[],
  tableName: string,
  appName?: string | null,
) => TableSchema = createSelector(
  getTableList,
  (_: any, tableName: string) => tableName,
  (_: any, __: any, applicationName: string) => applicationName,
  (tables, tableName, appName): any =>
    (tables &&
      tables
        .filter(({ application }) =>
          application && appName ? application.name.toLowerCase() === appName.toLowerCase() : !appName,
        )
        .find(({ name }) => name.toLowerCase() === tableName.toLowerCase())) ||
    {},
);

export const getTableApplication: ParametricSelector<TableSchema[], string, Application | void> = createSelector(
  getTableById,
  table => table && table.application,
);

export const getTableFields: ParametricSelector<TableSchema[], string, FieldSchema[]> = createSelector(
  getTableById,
  table => (table ? table.fields : []),
);

export const getTableApplicationName: ParametricSelector<TableSchema[], string, string> = createSelector(
  getTableApplication,
  table => (table ? table.name : ''),
);

export const getNoSystemTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(({ isSystem }) => !isSystem),
);

export const getSystemTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(({ isSystem }) => isSystem),
);

export const hasNoSystemTables: ParametricSelector<TableSchema[], void, boolean> = createSelector(
  getNoSystemTables,
  tables => tables.length > 0,
);

export const getUserTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(({ isSystem, application }) => !isSystem && !application),
);

export const getApplicationTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(({ application }) => !!application),
);

export const getTablesByApplicationName = createSelector(
  getTableList,
  (_: any, appName: string) => appName,
  (tablesList, appName) => tablesList.filter(({ application }) => application && application.name === appName),
);

export const getTablesByApplicationId = createSelector(
  getTableList,
  (_: any, appId: string) => appId,
  (tablesList, appId) => tablesList.filter(({ application }) => application && application.id === appId),
);

export const hasUserTables: ParametricSelector<TableSchema[], void, boolean> = createSelector(
  getUserTables,
  tables => tables.length > 0,
);
