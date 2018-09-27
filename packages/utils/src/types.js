// @flow
import {
  FIELD_TYPE,
  SWITCH_FORMATS,
  TEXT_FORMATS,
  NUMBER_FORMATS,
  FILE_FORMATS,
  DATE_FORMATS,
} from './constants';

type MutationType = 'CREATE' | 'UPDATE';

type FieldType = $Values<typeof FIELD_TYPE>;

type Format = $Values<typeof SWITCH_FORMATS>
  | $Values<typeof TEXT_FORMATS>
  | $Values<typeof NUMBER_FORMATS>
  | $Values<typeof FILE_FORMATS>
  | $Values<typeof DATE_FORMATS>;

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
