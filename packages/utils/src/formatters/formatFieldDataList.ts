import * as R from 'ramda';

import { MutationType, FieldSchema, Schema, FormatDataForMutationOptions } from '../types';
import { formatFieldDataListItem } from './formatFieldDataListItem';

interface IFormatFieldDataListMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
  initialData?: any;
}

const bindDataWithInitialData = (list: any[] = [], initialList: any[] = []) => {
  const result = [];
  const leftInitialList = [...initialList];

  const toResultObject = (data: any, initialData: any) => ({ data, initialData });

  const findById = (id: string) => (el: any) => R.path(['id'], el) === id;

  for (const item of list) {
    if (!item || (!item.id && typeof item !== 'string')) {
      result.push(toResultObject(item, null));
      continue;
    }

    const initialDataInx = leftInitialList.findIndex(item.id ? findById(item.id) : R.equals(item));
    let initialData = null;

    if (initialDataInx !== -1) {
      initialData = leftInitialList[initialDataInx];
      leftInitialList.splice(initialDataInx, 1);
    }

    result.push(toResultObject(item, initialData));
  }

  for (const item of leftInitialList) {
    if (!item || (!item.id && typeof item !== 'string')) {
      continue;
    }

    result.push(toResultObject(null, item));
  }

  return result;
};

export const formatFieldDataList = (
  type: MutationType,
  data: any,
  { fieldSchema, schema, initialData }: IFormatFieldDataListMeta,
  options?: FormatDataForMutationOptions,
) =>
  R.pipe(
    (data: any) => bindDataWithInitialData(data, initialData),
    // // @ts-ignore
    // data => console.log('binded data', data) || data,
    R.map(item =>
      formatFieldDataListItem(
        type,
        item.data,
        {
          fieldSchema,
          schema,
          initialData: item.initialData,
        },
        options,
      ),
    ),
    R.filter((item: any) => Boolean(item)),
    R.groupBy(R.prop('type')),
    R.mapObjIndexed(R.map(R.prop('data'))),
  )(data);
