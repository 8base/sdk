//@flow
import { isRelationReference, isRelationInstance } from '../verifiers';
import { formatRelationReferenceForMutation } from './formatRelationReferenceForMutation';
import { formatRelationInstanceForMutation } from './formatRelationInstanceForMutation';
import type { MutationType, FieldSchema, Schema } from '../types';

const formatFieldDataForMutation = (type: MutationType, fieldSchema: FieldSchema, data: Object, schema: Schema) => {
  let formatedData = data;

  if (isRelationReference(fieldSchema, data)) {
    formatedData = formatRelationReferenceForMutation(type, data);
  } else if (isRelationInstance(fieldSchema, data)) {
    formatedData = formatRelationInstanceForMutation(type, fieldSchema, data, schema);
  }

  return formatedData;
};

export { formatFieldDataForMutation };
