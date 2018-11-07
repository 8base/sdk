//@flow
import { formatFieldDataListItem } from './formatFieldDataListItem';

import type { MutationType, FieldSchema, Schema } from '../types';

export const formatFieldData = (type: MutationType, fieldSchema: FieldSchema, data: any, schema: Schema) => {
  const nextData = formatFieldDataListItem(type, fieldSchema, data, schema);

  return {
    [nextData.type]: nextData.data,
  };
};
