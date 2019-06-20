import { formatFieldDataListItem } from './formatFieldDataListItem';

import { MutationType, FieldSchema, Schema } from '../types';

interface IFormatFieldDataArgs {
  type: MutationType, 
  fieldSchema: FieldSchema, 
  data: any, 
  schema: Schema
}

export const formatFieldData = ({ type, fieldSchema, data, schema }: IFormatFieldDataArgs) => {
  const nextData = formatFieldDataListItem(type, fieldSchema, data, schema);

  return {
    [nextData.type]: nextData.data,
  };
};
