//@flow
import { getTableSchemaById } from '../selectors';
import { isListField } from '../verifiers';
import { formatDataForMutation } from './formatDataForMutation';
import type { MutationType, FieldSchema, TableSchema, Schema } from '../types';

const formatRelationInstanceForMutation = (type: MutationType, fieldSchema: FieldSchema, data: Object, schema: Schema) => {
  const relationTableSchema: ?TableSchema = getTableSchemaById(fieldSchema.relation.refTable.id, schema);

  if (!relationTableSchema) {
    throw new Error(`Relation table schema with ${fieldSchema.relation.refTable.id} id not found in schema.`);
  }

  let formatedData = data;

  if (isListField(fieldSchema)) {
    formatedData = formatedData.map((data) => formatDataForMutation(type, relationTableSchema.name, data, schema));
  } else {
    formatedData = formatDataForMutation(type, relationTableSchema.name, formatedData, schema);
  }

  formatedData = { create: formatedData };

  return formatedData;
};


export { formatRelationInstanceForMutation };
