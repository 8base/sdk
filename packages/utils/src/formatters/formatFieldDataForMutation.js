//@flow
import { isRelationReference, isRelationInstance, isFileReference, isFileInstance } from '../verifiers';
import { formatRelationReferenceForMutation } from './formatRelationReferenceForMutation';
import { formatRelationInstanceForMutation } from './formatRelationInstanceForMutation';
import { formatFileInstanceForMutation } from './formatFileInstanceForMutation';
import type { MutationType, FieldSchema, Schema } from '../types';

const formatFieldDataForMutation = (type: MutationType, fieldSchema: FieldSchema, data: Object, schema: Schema) => {
  let formatedData = data;

  if (isRelationReference(fieldSchema, data) || isFileReference(fieldSchema, data)) {
    formatedData = formatRelationReferenceForMutation(type, data);
  } else if (isRelationInstance(fieldSchema, data)) {
    formatedData = formatRelationInstanceForMutation(type, fieldSchema, data, schema);
  } else if (isFileInstance(fieldSchema, data)) {
    formatedData = formatFileInstanceForMutation(type, data);
  }

  return formatedData;
};

export { formatFieldDataForMutation };
