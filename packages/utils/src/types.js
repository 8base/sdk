// @flow
import {
  FIELD_TYPE,
  SWITCH_FORMATS,
  TEXT_FORMATS,
  NUMBER_FORMATS,
  FILE_FORMATS,
  DATE_FORMATS,
} from './constants';

export type MutationType = 'CREATE' | 'UPDATE';

export type FieldType = $Values<typeof FIELD_TYPE>;

export type Format = $Values<typeof SWITCH_FORMATS>
  | $Values<typeof TEXT_FORMATS>
  | $Values<typeof NUMBER_FORMATS>
  | $Values<typeof FILE_FORMATS>
  | $Values<typeof DATE_FORMATS>;

export type FieldSchema = {
  id: string,
  name: string,
  displayName?: string,
  description: ?string,
  fieldType: FieldType,
  fieldTypeAttributes: Object,
  isSystem: boolean,
  isList: boolean,
  isMeta: boolean,
  isRequired: boolean,
  isUnique: ?boolean,
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

export type Schema = Array<TableSchema>;

export type SchemaResponse = {
  items: Schema,
  count: number,
};

export type PossibleAuthItems = 'email' | 'userId' | 'workspaceId' | 'refreshToken' | 'token';

export type AuthState = {
  [PossibleAuthItems]: string,
};

export type AuthData = {
  state: Object,
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

export type QueryGeneratorConfig = {
  deep?: number,
  withMeta?: boolean,
  includeColumns?: null | string[],
};
