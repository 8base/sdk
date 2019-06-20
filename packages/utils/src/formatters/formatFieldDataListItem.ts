import * as R from 'ramda';

import { isRelationField, isFileField } from '../verifiers';
import { tablesListSelectors } from '../selectors';
import { MUTATION_TYPE, SYSTEM_TABLES } from '../constants';
import { formatDataForMutation } from './formatDataForMutation';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';
import { MutationType, FieldSchema, Schema, TableSchema } from '../types';

export const formatFieldDataListItem = (type: MutationType, fieldSchema: FieldSchema, data: any, schema: Schema) => {
  let nextData = data;

  if (R.isNil(nextData)) {
    return {
      data: {},
      type: type === MUTATION_TYPE.CREATE ? 'connect' : 'reconnect',
    };
  } else if (typeof nextData === 'string') {
    return {
      data: { id: nextData },
      type: type === MUTATION_TYPE.CREATE ? 'connect' : 'reconnect',
    };
  } else if (typeof nextData.id === 'string') {
    return {
      data: { id: nextData.id },
      type: type === MUTATION_TYPE.CREATE ? 'connect' : 'reconnect',
    };
  }

  if (isRelationField(fieldSchema)) {
    const relationTableSchema = tablesListSelectors.getTableById(schema, fieldSchema.relation.refTable.id);

    if (!relationTableSchema) {
      throw new SDKError(
        ERROR_CODES.TABLE_NOT_FOUND,
        PACKAGES.UTILS,
        `Relation table schema with ${fieldSchema.relation.refTable.id} id not found in schema.`,
      );
    }

    nextData = formatDataForMutation({
      type: MUTATION_TYPE.CREATE, 
      tableName: relationTableSchema.name, 
      data: nextData, 
      schema
    });
  }

  if (isFileField(fieldSchema)) {
    nextData = formatDataForMutation({
      type: MUTATION_TYPE.CREATE, 
      tableName: SYSTEM_TABLES.FILES, 
      data: nextData, 
      schema
    });
  }

  return {
    data: nextData,
    type: 'create',
  };
};
