// @flow
import type { TableSchema } from '@8base/utils';


export type GeneratorsCommonConfig = {
  deep: number,
  withMeta?: boolean,
};

export type GeneratorsConfig = {
  includeColumns?: string[],
} & GeneratorsCommonConfig;

export type GeneratorsData = {
  tablesList: TableSchema,
  tableName: string,
  screenName?: string,
};

export type ScreenTable = {
  id?: string,
  tableName: string,
  screenName: string,
  routeUrl?: string,
  tableFields?: string[],
  formFields?: string[],
};
