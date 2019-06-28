import R from 'ramda';
import { TableSchema, FieldSchema, Application } from '../types';
import { createSelector, ParametricSelector } from 'reselect';

export const getTableList = (tables?: TableSchema[]) => tables || [];

export const getTableById: ParametricSelector<TableSchema[], string, TableSchema | void> = createSelector(
  getTableList,
  (_: any, tableId: string) => tableId,
  (tables, tableId) => tables && tables.find(({ id }) => id === tableId),
);

export const getTableByName: ParametricSelector<TableSchema[], any, TableSchema | void> = createSelector(
  getTableList,
  (_: any, tableName: string) => tableName,
  (_: any, __: any, applicationName: string) => applicationName,
  (tables, tableName, applicationName) =>
    tables &&
    tables
      .filter(({ application }) =>
        application && applicationName
          ? application.name.toLowerCase() === applicationName.toLowerCase()
          : !applicationName,
      )
      .find(({ name }) => name.toLowerCase() === tableName.toLowerCase()),
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
  tablesList => tablesList.filter(R.propEq('isSystem', false)),
);

export const getSystemTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(R.propEq('isSystem', true)),
);

export const hasNoSystemTables: ParametricSelector<TableSchema[], void, boolean> = createSelector(
  getNoSystemTables,
  tables => tables.length > 0,
);

export const getTablesByApplicationName = createSelector(
  getTableList,
  (applicationName: string) => applicationName,
  (tablesList, applicationName) =>
    tablesList.filter(({ application }) => application && application.name === applicationName),
);

export const getUserTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(({ isSystem, application }) => !isSystem && !application),
);

export const hasUserTables: ParametricSelector<TableSchema[], void, boolean> = createSelector(
  getUserTables,
  tables => tables.length > 0,
);
