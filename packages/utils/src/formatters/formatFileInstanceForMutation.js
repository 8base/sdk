//@flow
import type { MutationType, FieldSchema } from '../types';
import { isListField } from '../verifiers';

const formatFileInstanceForMutation = (type: MutationType, fieldSchema: FieldSchema, data: Object) => {
  if (isListField(fieldSchema)) {
    return { create: data.map((value) => ({ $file: value })) };
  }

  return { create: { $file: data }};
};


export { formatFileInstanceForMutation };
