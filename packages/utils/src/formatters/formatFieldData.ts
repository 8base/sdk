import { formatFieldDataListItem } from './formatFieldDataListItem';

import { MutationType, FieldSchema, Schema } from '../types';

interface IFormatFieldDataMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
}

export const formatFieldData = (type: MutationType, data: any, { fieldSchema, schema }: IFormatFieldDataMeta) => {
  const nextData = formatFieldDataListItem(type, data, { fieldSchema, schema });

  return {
    [nextData.type]: nextData.data,
  };
};
