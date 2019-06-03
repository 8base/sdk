// @flow
import type { Schema } from '@8base/utils';

export const getTableById = (
  schema: ?Schema,
  tableId?: string,
) => schema && schema.find(({ id }) => id === tableId);

export const getTableByName = (
  schema: ?Schema,
  tableName?: string,
) => schema && schema.find(({ name }) => name === tableName);
