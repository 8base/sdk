import {
  FIELD_TYPE,
  SWITCH_FORMATS,
  TEXT_FORMATS,
  NUMBER_FORMATS,
  FILE_FORMATS,
  DATE_FORMATS,
  MUTATION_TYPE,
  SMART_FORMATS,
} from './constants';

export type MutationType = keyof typeof MUTATION_TYPE;

export type FieldType =keyof typeof FIELD_TYPE;

export type Format = 
    keyof typeof SWITCH_FORMATS
  | keyof typeof TEXT_FORMATS
  | keyof typeof NUMBER_FORMATS
  | keyof typeof FILE_FORMATS
  | keyof typeof SMART_FORMATS
  | keyof typeof DATE_FORMATS;

export type FieldSchema = {
  id: string,
  name: string,
  displayName?: string,
  description?: string,
  fieldType: FieldType,
  fieldTypeAttributes: { [key: string]: any },
  isSystem: boolean,
  isList: boolean,
  isMeta: boolean,
  isRequired: boolean,
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
      name: string,
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

export type Schema = Array<TableSchema>;

export type SchemaResponse = {
  items: Schema,
  count: number,
};


export type AuthState = {
  email?: string,
  userId?: string,
  workspaceId?: string,
  refreshToken?: string,
  token?: string,
}

export type AuthData = {
  state: Object,
  isEmailVerified: boolean,
  idToken: string,
  email: string,
  idTokenPayload: Object,
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

export type QueryGeneratorConfig = {
  deep?: number,
  withMeta?: boolean,
  relationItemsCount?: number,
  includeColumns?: null | string[],
};

export type FormatDataAfterQueryOptions = {
  formatRelationToIds?: boolean,
};
