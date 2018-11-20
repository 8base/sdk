//@flow
import * as R from 'ramda';

import { isRelationField } from '../verifiers';
import { getTableSchemaById } from '../selectors';
import { MUTATION_TYPE } from '../constants';
import { formatDataForMutation } from './formatDataForMutation';

import type { MutationType, FieldSchema, Schema, TableSchema } from '../types';

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
    const relationTableSchema: ?TableSchema = getTableSchemaById(fieldSchema.relation.refTable.id, schema);

    if (!relationTableSchema) {
      throw new Error(`Relation table schema with ${fieldSchema.relation.refTable.id} id not found in schema.`);
    }

    nextData = formatDataForMutation(type, relationTableSchema.name, nextData, schema);
  }

  return {
    type: 'create',
    data: nextData,
  };
};
