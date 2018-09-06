// @flow
import type { TableSchema } from '@8base/utils';

export const getTableById = (tables: TableSchema, tableId?: string) => tables.find(({ id }) => id === tableId);

export const getTableByName = (tables: TableSchema, tableName?: string) => tables.find(({ name }) => name === tableName);
