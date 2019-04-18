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

export type FieldType = keyof typeof FIELD_TYPE;

export type Format =
  | keyof typeof SWITCH_FORMATS
  | keyof typeof TEXT_FORMATS
  | keyof typeof NUMBER_FORMATS
  | keyof typeof FILE_FORMATS
  | keyof typeof SMART_FORMATS
  | keyof typeof DATE_FORMATS;

export type Relation = {
  relationTableName: string;
  relationFieldName?: string | null;
  refFieldName?: string | null;
  refFieldDisplayName?: string | null;
  refFieldIsList?: boolean | null;
  refFieldIsRequired?: boolean | null;
  refTable: {
    id: string;
    name?: string | null;
  };
};

export type FieldSchema = {
  id: string;
  name: string;
  displayName?: string | null;
  description?: string | null;
  fieldType?: string | null;
  fieldTypeAttributes?: { [key: string]: any } | null;
  isSystem: boolean;
  isList: boolean;
  isMeta: boolean;
  isRequired: boolean;
  isUnique?: boolean | null;
  defaultValue: any;
  relation?: Relation | null;
};

export type TableSchema = {
  id: string;
  name: string;
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
  purgeAuthState(): Promise<void>;
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
  relationItemsCount?: number;
  includeColumns?: null | string[];
};

export type FormatDataAfterQueryOptions = {
  formatRelationToIds?: boolean;
};
