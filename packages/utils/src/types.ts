import {
  FIELD_TYPE,
  SWITCH_FORMATS,
  TEXT_FORMATS,
  NUMBER_FORMATS,
  FILE_FORMATS,
  DATE_FORMATS,
  MUTATION_TYPE,
  SMART_FORMATS,
  APP_STATUS,
} from './constants';

export type MutationType = keyof typeof MUTATION_TYPE;

export type FieldType = keyof typeof FIELD_TYPE;

export type Format =
  | keyof typeof SWITCH_FORMATS
  | keyof typeof TEXT_FORMATS
  | keyof typeof NUMBER_FORMATS
  | keyof typeof FILE_FORMATS
  | keyof typeof SMART_FORMATS
  | keyof typeof DATE_FORMATS;

export type FieldSchema = {
  id: string;
  name: string;
  displayName: string;
  table: {
    id: string;
    name: string;
    displayName: string;
  };
  description?: string;
  fieldType: FieldType;
  fieldTypeAttributes: { [key: string]: any };
  isSystem: boolean;
  isList: boolean;
  isMeta: boolean;
  isRequired: boolean;
  isUnique?: boolean;
  defaultValue: any;
  relation: {
    id: string;
    relationTableName: string;
    relationFieldName: string;
    refFieldName: string;
    refFieldDisplayName: string;
    refFieldIsList: boolean;
    refFieldIsRequired: boolean;
    refTable: {
      id: string;
      name: string;
      displayName: string;
    };
  };
};

export type Application = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  tableCount: number;
  resolverCount: number;
  status: keyof typeof APP_STATUS;
  appType: string;
};

export type TableSchema = {
  id: string;
  name: string;
  application: Application;
  displayName?: string;
  isSystem?: boolean;
  fields: FieldSchema[];
};

export type Schema = TableSchema[];

export type SchemaResponse = {
  items: Schema;
  count: number;
};

export type AuthState = {
  email?: string;
  userId?: string;
  workspaceId?: string;
  refreshToken?: string;
  token?: string;
};

export type AuthData = {
  state?: object;
  isEmailVerified: boolean;
  idToken: string;
  email: string;
  idTokenPayload: any;
};

export interface IAuthClient {
  getAuthState(): Promise<AuthState>;
  setAuthState(state: AuthState): Promise<void>;
  purgeAuthState(options?: { withLogout?: boolean; logoutOptions?: object }): Promise<void>;
  checkIsAuthorized(): Promise<boolean>;
}

export interface IAuthorizable {
  authorize(options?: object): Promise<void>;
  renewToken(options?: object): Promise<AuthData>;
  changePassword(): Promise<{ email: string }>;
  logout(options?: object): Promise<void>;
}

export type QueryGeneratorConfig = {
  deep?: number;
  withMeta?: boolean;
  withResultData?: boolean;
  relationItemsCount?: number;
  includeColumns?: null | string[];
  permissions?: Object;
};

export type FormatDataAfterQueryOptions = {
  formatRelationToIds?: boolean;
};
