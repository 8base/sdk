// @flow
import type { TableSchema } from '@8base/utils';

export const getTableById = (tables: Array<TableSchema>, tableId?: string) => tables.find(({ id }) => id === tableId);

export const getTableByName = (tables: Array<TableSchema>, tableName?: string) => tables.find(({ name }) => name === tableName);
