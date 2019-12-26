import { MutationType, FieldSchema, Schema, FormatDataForMutationOptions } from '../types';
import { formatFieldDataListItem } from './formatFieldDataListItem';

interface IFormatFieldDataMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
  initialData?: any;
}

export const formatFieldData = (
  type: MutationType,
  data: any,
  { fieldSchema, schema, initialData }: IFormatFieldDataMeta,
  options?: FormatDataForMutationOptions,
) => {
  const nextData = formatFieldDataListItem(type, data, { fieldSchema, schema, initialData }, options);

  return nextData
    ? {
        [nextData.type]: nextData.data,
      }
    : null;
};
