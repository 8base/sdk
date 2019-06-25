import R from 'ramda';
import { TableSchema, FieldSchema } from '../types';
import { createSelector, ParametricSelector } from 'reselect';

export const getTableList = (tables?: TableSchema[]) => tables || [];

export const getTableById: ParametricSelector<TableSchema[], string, TableSchema | void> = createSelector(
  getTableList,
  (_: any, tableId: string) => tableId,
  (tables, tableId) => tables && tables.find(({ id }) => id === tableId),
);

export const getTableByName: (state: TableSchema[], tableName: string) => TableSchema = createSelector(
  getTableList,
  (_: any, tableName: string) => tableName,
  (tables, tableName) => tables && tables.find(({ name }) => name.toLowerCase() === tableName.toLowerCase()),
) as any;

export const getTableFields: ParametricSelector<TableSchema[], string, FieldSchema[]> = createSelector(
  getTableById,
  table => (table ? table.fields : []),
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

export const getUserTables: ParametricSelector<TableSchema[], void, TableSchema[]> = createSelector(
  getTableList,
  tablesList => tablesList.filter(({ isSystem }) => !isSystem),
);

export const hasUserTables: ParametricSelector<TableSchema[], void, boolean> = createSelector(
  getUserTables,
  tables => tables.length > 0,
);
