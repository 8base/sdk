import * as R from 'ramda';

import { isRelationField, isFileField, isListField } from '../verifiers';
import { tablesListSelectors } from '../selectors';
import { MUTATION_TYPE, SYSTEM_TABLES } from '../constants';
import { formatDataForMutation } from './formatDataForMutation';
import { SDKError, ERROR_CODES, PACKAGES } from '../errors';
import { MutationType, FieldSchema, Schema, FormatDataForMutationOptions } from '../types';

interface IFormatFieldDataListItemMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
  initialData?: any;
}

export const formatFieldDataListItem = (
  type: MutationType,
  data: any,
  { fieldSchema, schema, initialData }: IFormatFieldDataListItemMeta,
  options?: FormatDataForMutationOptions,
) => {
  let nextData = data;

  if (R.isNil(nextData)) {
    if (initialData && initialData.id) {
      return {
        data: { id: initialData.id },
        type: 'disconnect',
      };
    }

    if (typeof initialData === 'string') {
      return {
        data: { id: initialData },
        type: 'disconnect',
      };
    }

    return null;
  }

  if (typeof nextData === 'string') {
    return {
      data: { id: nextData },
      type: 'connect',
    };
  }

  if (typeof nextData.id === 'string' && type === MUTATION_TYPE.CREATE) {
    return {
      data: { id: nextData.id },
      type: 'connect',
    };
  }

  // TODO: is it valid case?
  if (!R.isNil(nextData.length) && nextData.length === 0 && type === MUTATION_TYPE.UPDATE) {
    return null;
  }

  const shouldUpdate = type === MUTATION_TYPE.UPDATE && typeof nextData.id === 'string';
  const nextFormatDataForMutationType = shouldUpdate ? MUTATION_TYPE.UPDATE : MUTATION_TYPE.CREATE;

  if (isRelationField(fieldSchema)) {
    const relationTableSchema = tablesListSelectors.getTableById(schema, fieldSchema.relation.refTable.id);

    if (!relationTableSchema) {
      throw new SDKError(
        ERROR_CODES.TABLE_NOT_FOUND,
        PACKAGES.UTILS,
        `Relation table schema with ${fieldSchema.relation.refTable.id} id not found in schema.`,
      );
    }

    nextData = formatDataForMutation(
      nextFormatDataForMutationType,
      nextData,
      {
        tableName: relationTableSchema.name,
        schema,
        initialData,
      },
      options,
    );
  }

  if (isFileField(fieldSchema)) {
    nextData = formatDataForMutation(
      nextFormatDataForMutationType,
      nextData,
      {
        tableName: SYSTEM_TABLES.FILES,
        schema,
        initialData,
      },
      options,
    );
  }

  if (shouldUpdate) {
    return {
      type: 'update',
      data: isListField(fieldSchema) ? { data: nextData, filter: { id: data.id } } : R.dissoc('id', nextData),
    };
  }

  return {
    data: nextData,
    type: 'create',
  };
};
