//@flow
import type { MutationType } from '../types';

const formatFileCreationForMutation = (type: MutationType, data: Object) => {
  return { create: data };
};

export { formatFileCreationForMutation };
