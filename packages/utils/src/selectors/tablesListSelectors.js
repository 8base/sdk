// @flow
import type { TableSchema } from '../types';
import * as R from 'ramda';
import { createSelector } from 'reselect';

export const getTableList = (tables?: TableSchema[]) => tables || [];


export const getTableById = createSelector(
  getTableList,
  (_, tableId) => tableId,
  (tables, tableId) => tables && tables.find(({ id }) => id === tableId),
);

export const getTableByName = createSelector(
  getTableList,
  (_, tableName) => tableName,
  (_, __, applicationName) => applicationName,
  (tables, tableName, applicationName) => tables && tables
    .filter(({ application }) => application ? application.name.toLowerCase() === applicationName.toLowerCase() : !applicationName)
    .find(({ name }) => name.toLowerCase() === tableName.toLowerCase()),
);

export const getTableApplication = createSelector(
  getTableById,
  R.prop('application'),
);

export const getTableApplicationName = createSelector(
  getTableApplication,
  R.propOr('', 'name'),
);

export const getNoSystemTables = createSelector(
  getTableList,
  R.filter(R.propEq('isSystem', false)),
);

export const getSystemTables = createSelector(
  getTableList,
  R.filter(R.propEq('isSystem', true)),
);

export const hasNoSystemTables = createSelector(
  getNoSystemTables,
  tables => tables.length > 0,
);

export const getUserTables = createSelector(
  getTableList,
  R.filter(({ isSystem, application }) => !isSystem && !application),
);

export const hasUserTables = createSelector(
  getUserTables,
  tables => tables.length > 0,
);
