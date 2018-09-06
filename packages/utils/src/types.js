// @flow
import { FIELD_TYPE, FORMAT } from './constants';

type MutationType = 'CREATE' | 'UPDATE';

type FieldType = $Values<typeof FIELD_TYPE>;

type Format = $Values<typeof FORMAT>;

type FieldSchema = {
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

type TableSchema = {
  id: string,
  name: string,
  displayName?: string,
  isSystem: boolean,
  fields: Array<FieldSchema>,
};

type Schema = Array<TableSchema>;

export type {
  MutationType,
  FieldType,
  Format,
  FieldSchema,
  TableSchema,
  Schema,
};
