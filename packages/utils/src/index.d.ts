
export type FieldSchema = {
  id: string,
  name: string,
  displayName?: string,
  description?: string,
  fieldType: string,
  fieldTypeAttributes: Object,
  isSystem: boolean,
  isList: boolean,
  isMeta: boolean,
  isRequired: boolean,
  isExternal: boolean,
  isUnique?: boolean,
  defaultValue: any,
  relation: {
    id: string,
    relationTableName: string,
    relationFieldName: string,
    refFieldName: string,
    refFieldDisplayName: string,
    refFieldIsList: boolean,
    refFieldIsRequired: boolean,
    refTable: {
      id: string,
    },
  },
};

export type TableSchema = {
  id: string,
  name: string,
  displayName?: string,
  isSystem?: boolean,
  fields: Array<FieldSchema>,
};

export type QueryGeneratorConfig = {
  deep?: number,
  withMeta?: boolean,
  relationItemsCount?: number,
  withResultData?: boolean,
  includeColumns?: null | string[],
};

type CreateQueryColumnsListConfig = {
  flatten?: boolean,
} & QueryGeneratorConfig


export type Schema = Array<TableSchema>;

export function createQueryColumnsList(
  tablesList: TableSchema[],
  tableName: string,
  config?: CreateQueryColumnsListConfig,
): Array<{ name: string, title: string, meta: Object }>;


export const FIELD_TYPE: {
  DATE: 'DATE',
  FILE: 'FILE',
  ID: 'ID',
  NUMBER: 'NUMBER',
  RELATION: 'RELATION',
  SWITCH: 'SWITCH',
  TEXT: 'TEXT',
  SMART: 'SMART',
  JSON: 'JSON',
};

export const SWITCH_FORMATS: {
  ON_OFF: 'ON_OFF',
  YES_NO: 'YES_NO',
  TRUE_FALSE: 'TRUE_FALSE',
  ACTIVE_INACTIVE: 'ACTIVE_INACTIVE',
  HIGH_LOW: 'HIGH_LOW',
  CUSTOM: 'CUSTOM',
};

export const SWITCH_VALUES: {
  ON_OFF: {
    true: 'On',
    false: 'Off',
  },
  YES_NO: {
    true: 'Yes',
    false: 'No',
  },
  TRUE_FALSE: {
    true: 'True',
    false: 'False',
  },
  ACTIVE_INACTIVE: {
    true: 'Active',
    false: 'Inactive',
  },
  HIGH_LOW: {
    true: 'High',
    false: 'Low',
  },
};

export const TEXT_FORMATS: {
  UNFORMATTED: 'UNFORMATTED',
  NAME: 'NAME',
  SSN: 'SSN',
  EIN: 'EIN',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
};

export const NUMBER_FORMATS: {
  NUMBER: 'NUMBER',
  CURRENCY: 'CURRENCY',
  PERCENTAGE: 'PERCENTAGE',
  FRACTION: 'FRACTION',
  SCIENTIFIC: 'SCIENTIFIC',
};

export const FILE_FORMATS: {
  FILE: 'FILE',
  IMAGE: 'IMAGE',
};

export const SMART_FORMATS: {
  ADDRESS: 'ADDRESS',
  PHONE: 'PHONE',
};

export const DATE_FORMATS: {
  DATE: 'DATE',
  DATETIME: 'DATETIME',
};

export const MUTATION_TYPE: {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
};

export const SYSTEM_TABLES: {
  USERS: 'Users',
  FILES: 'Files',
  SETTINGS: 'Settings',
  ROLES: 'Roles',
  INVITATIONS: 'Invitations',
  PERMISSIONS: 'Permissions',
  API_TOKENS: 'ApiTokens',
  ENVIRONMENT_VARIABLES: 'EnvironmentVariables',
};

export const MUTATION_FILE_FIELDS: ['fileId', 'public', 'filename', 'meta', 'mods'];

export type QueryGeneratorData = {
  tablesList: TableSchema[],
  tableName: string,
  appName?: string,
};

export const tablesListSelectors: {
  [key: string]: Function
}

export const tableSelectors: {
  [key: string]: Function
}

export const tableFieldSelectors: { [key: string]: Function };

export const throwIfMissingRequiredOption: Function;

export type AuthState = {
  email?: string,
  userId?: string,
  workspaceId?: string,
  refreshToken?: string,
  token?: string,
}

export type AuthData = {
  isEmailVerified: boolean,
  idToken: string,
  email: string,
  idTokenPayload: Object,
  state: any,
};

export interface AuthClient {
  getAuthState(): Promise<AuthState>,
  setAuthState(state: AuthState): Promise<void>,
  purgeAuthState(): Promise<void>,
  checkIsAuthorized(): Promise<boolean>,
}

export interface Authorizable {
  authorize(options?: Object): Promise<AuthData>,
  renewToken(options?: Object): Promise<AuthData>,
  changePassword(): Promise<{ email: string }>,
  logout(options?: Object): Promise<void>,
}
