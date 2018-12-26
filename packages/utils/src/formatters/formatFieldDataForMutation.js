//@flow
import * as R from 'ramda';

import { isListField, isFileField, isRelationField, isAddressField, isEmptyAddress } from '../verifiers';
import { formatFieldDataList } from './formatFieldDataList';
import { formatFieldData } from './formatFieldData';

import type { MutationType, FieldSchema, Schema } from '../types';

const formatFieldDataForMutation = (type: MutationType, fieldSchema: FieldSchema, data: any, schema: Schema) => {
  let nextData = data;

  if (isFileField(fieldSchema) || isRelationField(fieldSchema)) {
    if (isListField(fieldSchema)) {
      nextData = formatFieldDataList(type, fieldSchema, data, schema);
    } else {
      nextData = formatFieldData(type, fieldSchema, data, schema);
    }
  } else if (isAddressField(fieldSchema)) {
    if (isListField(fieldSchema)) {
      if (Array.isArray(nextData)) {
        nextData = R.reject(isEmptyAddress, nextData);
      }
    } else {
      if (isEmptyAddress(nextData)) {
        nextData = null;
      }
    }
  }

  return nextData;
};

export { formatFieldDataForMutation };
