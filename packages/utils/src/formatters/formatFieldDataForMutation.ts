import * as R from 'ramda';

import * as verifiers from '../verifiers';
import { formatFieldDataList } from './formatFieldDataList';
import { formatFieldData } from './formatFieldData';

import { MutationType, FieldSchema, Schema } from '../types';

const formatJSON = (data: any) => {
  if (typeof data === 'string' && data.length === 0) {
    return null;
  }

  return JSON.parse(data);
};

interface IFormatFieldDataForMutationMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
}

const formatFieldDataForMutation = (
  type: MutationType,
  data: any,
  { fieldSchema, schema }: IFormatFieldDataForMutationMeta,
) => {
  let nextData = data;

  if (verifiers.isFileField(fieldSchema) || verifiers.isRelationField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      nextData = formatFieldDataList(type, data, { fieldSchema, schema });
    } else {
      nextData = formatFieldData(type, data, { fieldSchema, schema });
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
  } else if (verifiers.isPhoneField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      if (Array.isArray(nextData)) {
        nextData = R.reject(verifiers.isEmptyPhone, nextData);
      }
    } else {
      if (verifiers.isEmptyPhone(nextData)) {
        nextData = null;
      }
    }
  } else if (verifiers.isNumberField(fieldSchema) && !verifiers.isBigInt(fieldSchema)) {
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
  } else if (verifiers.isJSONField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      nextData = R.map(formatJSON, nextData);
    } else {
      nextData = formatJSON(nextData);
    }
  }

  return nextData;
};

export { formatFieldDataForMutation };
