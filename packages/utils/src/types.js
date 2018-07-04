// @flow
type MutationType = 'CREATE' | 'UPDATE';

type FieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'SWITCH' | 'ID';

type FieldSchema = {
  id: string,
  name: string,
  displayName?: string,
  description: ?string,
  fieldType: FieldType,
  fieldTypeAttributes: Object,
  isList: boolean,
  isRequired: boolean,
  isUnique: boolean,
  defaultValue: any,
  relation: {
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
  FieldSchema,
  TableSchema,
  Schema,
};
