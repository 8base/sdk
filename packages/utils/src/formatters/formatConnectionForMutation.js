//@flow
import { MUTATION_TYPE } from '../constants';
import type { MutationType } from '../types';

const formatConnectionForMutation = (type: MutationType, data: Object) => {
  let formatedData = data;

  if (Array.isArray(formatedData)) {
    formatedData = formatedData.map((id) => ({ id }));
  } else {
    formatedData = { id: formatedData };
  }

  if (type === MUTATION_TYPE.CREATE) {
    formatedData = { connect: formatedData };
  } else if (type === MUTATION_TYPE.UPDATE) {
    formatedData = { reconnect: formatedData };
  }

  return formatedData;
};


export { formatConnectionForMutation };
