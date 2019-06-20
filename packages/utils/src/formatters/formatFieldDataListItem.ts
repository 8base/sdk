import * as R from 'ramda';

import { isRelationField, isFileField } from '../verifiers';
import { tablesListSelectors } from '../selectors';
import { MUTATION_TYPE, SYSTEM_TABLES } from '../constants';
import { formatDataForMutation } from './formatDataForMutation';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';
import { MutationType, FieldSchema, Schema } from '../types';

interface IFormatFieldDataListItemMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
}

export const formatFieldDataListItem = (
  type: MutationType,
  data: any,
  { fieldSchema, schema }: IFormatFieldDataListItemMeta,
) => {
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

    nextData = formatDataForMutation(MUTATION_TYPE.CREATE, nextData, {
      tableName: relationTableSchema.name,
      schema,
    });
  }

  if (isFileField(fieldSchema)) {
    nextData = formatDataForMutation(MUTATION_TYPE.CREATE, nextData, {
      tableName: SYSTEM_TABLES.FILES,
      schema,
    });
  }

  return {
    data: nextData,
    type: 'create',
  };
};
