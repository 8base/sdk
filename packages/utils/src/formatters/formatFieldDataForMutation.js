//@flow
import * as R from 'ramda';

import * as verifiers from '../verifiers';
import { formatFieldDataList } from './formatFieldDataList';
import { formatFieldData } from './formatFieldData';

import type { MutationType, FieldSchema, Schema } from '../types';

const formatFieldDataForMutation = (type: MutationType, fieldSchema: FieldSchema, data: any, schema: Schema) => {
  let nextData = data;

  if (verifiers.isFileField(fieldSchema) || verifiers.isRelationField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      nextData = formatFieldDataList(type, fieldSchema, data, schema);
    } else {
      nextData = formatFieldData(type, fieldSchema, data, schema);
    }
  } else if (verifiers.isAddressField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      if (Array.isArray(nextData)) {
        nextData = R.reject(verifiers.isEmptyAddress, nextData);
      }
    } else {
      if (verifiers.isEmptyAddress(nextData)) {
        nextData = null;
      }
    }
  } else if (verifiers.isNumberField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      if (Array.isArray(nextData)) {
        nextData = R.reject(verifiers.isEmptyNumber, nextData);

        nextData = R.map(Number, nextData);
      }
    } else {
      if (verifiers.isEmptyNumber(nextData)) {
        nextData = null;
      } else {
        nextData = Number(nextData);
      }
    }
  }

  return nextData;
};

export { formatFieldDataForMutation };
