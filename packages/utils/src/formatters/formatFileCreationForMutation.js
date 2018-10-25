//@flow
import * as R from 'ramda';

import type { MutationType } from '../types';

const formatFileCreationForMutation = (type: MutationType, data: Object) => {
  if (Array.isArray(data)) {
    data = R.reject(R.isNil, data);
  } else if (R.isNil(data)) {
    return data;
  }

  return { create: data };
};

export { formatFileCreationForMutation };
