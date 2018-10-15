// @flow
import type { SchemaResponse, } from '@8base/utils';

export const getTableById = (
  schemaResponse: SchemaResponse,
  tableId?: string,
) => schemaResponse.items.find(({ id }) => id === tableId);

export const getTableByName = (
  schemaResponse: SchemaResponse,
  tableName?: string,
) => schemaResponse.items.find(({ name }) => name === tableName);
