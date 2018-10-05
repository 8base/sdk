//@flow
import type { MutationType } from '../types';

const formatFileCreationForMutation = (type: MutationType, data: Object, isEntity: boolean) => {
  return isEntity
    ? { create: { $file: data }}
    : { create: data };
};


export { formatFileCreationForMutation };
