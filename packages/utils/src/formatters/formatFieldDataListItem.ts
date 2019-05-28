import * as R from 'ramda';

import { isRelationField, isFileField } from '../verifiers';
import { getTableSchemaById } from '../selectors';
import { MUTATION_TYPE, SYSTEM_TABLES } from '../constants';
import { formatDataForMutation } from './formatDataForMutation';

import { MutationType, FieldSchema, Schema, TableSchema } from '../types';

export const formatFieldDataListItem = (type: MutationType, fieldSchema: FieldSchema, data: any, schema: Schema) => {
  let nextData = data;

  if (R.isNil(nextData)) {
    return {
      type: type === MUTATION_TYPE.CREATE ? 'connect' : 'reconnect',
      data: {},
    };
  } else if (typeof nextData === 'string') {
    return {
      type: type === MUTATION_TYPE.CREATE ? 'connect' : 'reconnect',
      data: { id: nextData },
    };
  } else if (typeof nextData.id === 'string') {
    return {
      type: type === MUTATION_TYPE.CREATE ? 'connect' : 'reconnect',
      data: { id: nextData.id },
    };
  }

  if (isRelationField(fieldSchema)) {
    const relationTableSchema = getTableSchemaById(schema, fieldSchema.relation.refTable.id);

    if (!relationTableSchema) {
      throw new Error(`Relation table schema with ${fieldSchema.relation.refTable.id} id not found in schema.`);
    }

    nextData = formatDataForMutation(MUTATION_TYPE.CREATE, relationTableSchema.name, nextData, schema);
  }

  if (isFileField(fieldSchema)) {
    nextData = formatDataForMutation(MUTATION_TYPE.CREATE, SYSTEM_TABLES.FILES, nextData, schema);
  }

  return {
    type: 'create',
    data: nextData,
  };
};
