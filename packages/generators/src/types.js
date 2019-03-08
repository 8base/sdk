// @flow
import type { TableSchema } from '@8base/utils';

export type GeneratorsConfig = {
  deep: number,
  includeColumns?: string[],
};

export type GeneratorsData = {
  tablesList: TableSchema,
  tableName: string,
  screenName?: string,
};

export type ScreenTable = {
  id: string,
  tableName: string,
  screenName: string,
  routeUrl: string,
  tableFields?: string[],
  formFields?: string[],
};
