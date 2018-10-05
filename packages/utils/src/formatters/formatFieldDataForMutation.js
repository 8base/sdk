//@flow
import { isRelationReference, isRelationInstance, isFileReference, isFileInstance } from '../verifiers';
import { formatConnectionForMutation } from './formatConnectionForMutation';
import { formatRelationCreationForMutation } from './formatRelationCreationForMutation';
import { formatFileCreationForMutation } from './formatFileCreationForMutation';
import type { MutationType, FieldSchema, Schema } from '../types';

const formatFieldDataForMutation = (type: MutationType, fieldSchema: FieldSchema, data: Object, schema: Schema) => {
  let formatedData = data;

  if (isRelationReference(fieldSchema, data) || isFileReference(fieldSchema, data)) {
    formatedData = formatConnectionForMutation(type, data);
  } else if (isRelationInstance(fieldSchema, data)) {
    formatedData = formatRelationCreationForMutation(type, fieldSchema, data, schema);
  } else if (isFileInstance(fieldSchema, data)) {
    formatedData = formatFileCreationForMutation(type, data);
  }

  return formatedData;
};

export { formatFieldDataForMutation };
