//@flow
import type { MutationType } from '../types';

const formatFileInstanceForMutation = (type: MutationType, data: Object) => {
  return { create: { $file: data }};
};


export { formatFileInstanceForMutation };
