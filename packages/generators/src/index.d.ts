import { TableSchema } from '@8base/utils';

export const REPO_BRANCH_NAME: string;

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


export function replaceInitialApp(fsObject: Object, constants: {
  endpoint: string,
  authClientId: string,
  authDomain: string,
  appName: string,
}): Object;

export function generateScreen(data: {
  tablesList: TableSchema[],
  screen: ScreenTable,
  rootFile?: string,
}, config: GeneratorsCommonConfig): Object;
