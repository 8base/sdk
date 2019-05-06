
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
