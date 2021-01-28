import * as R from 'ramda';

import * as verifiers from '../verifiers';
import { MutationType, FieldSchema, Schema, FormatDataForMutationOptions } from '../types';
import { formatFieldDataList } from './formatFieldDataList';
import { formatFieldData } from './formatFieldData';

const formatJSON = (data: any) => {
  if (typeof data === 'string' && data.length === 0) {
    return null;
  }

  let formattedData = data;

  try {
    formattedData = JSON.parse(data);
    // tslint:disable-next-line
  } catch (e) {}

  return formattedData;
};

interface IFormatFieldDataForMutationMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
  initialData?: any;
}

const formatFieldDataForMutation = (
  type: MutationType,
  data: any,
  { fieldSchema, schema, initialData }: IFormatFieldDataForMutationMeta,
  options?: FormatDataForMutationOptions,
) => {
  let nextData = data;

  if (verifiers.isFileField(fieldSchema) || verifiers.isRelationField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      nextData = formatFieldDataList(type, data, { fieldSchema, schema, initialData }, options);
    } else {
      nextData = formatFieldData(type, data, { fieldSchema, schema, initialData }, options);
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
  } else if (verifiers.isNumberField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      if (Array.isArray(nextData)) {
        nextData = R.reject(verifiers.isEmptyNumber, nextData);

        if (!verifiers.isBigInt(fieldSchema)) {
          nextData = R.map(Number, nextData);
        }
      }
    } else {
      if (verifiers.isEmptyNumber(nextData)) {
        nextData = null;
      } else if (!verifiers.isBigInt(fieldSchema)) {
        nextData = Number(nextData);
      }
    }
  } else if (verifiers.isJSONField(fieldSchema)) {
    if (verifiers.isListField(fieldSchema)) {
      nextData = R.map(formatJSON, nextData);
    } else {
      nextData = formatJSON(nextData);
    }
  } else if (verifiers.isGeoField(fieldSchema) && Array.isArray(nextData)) {
    if (verifiers.isListField(fieldSchema)) {
      nextData = R.map(R.map(Number), nextData);
    } else {
      nextData = R.map(Number, nextData);
    }
  }

  return nextData;
};

export { formatFieldDataForMutation };
