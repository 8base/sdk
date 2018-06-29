//@flow
import { MUTATION_TYPE } from '../constants';
import type { MutationType } from '../types';

const formatRelationReferenceForMutation = (type: MutationType, data: Object) => {
  let formatedData = data;

  if (type === MUTATION_TYPE.CREATE) {
    formatedData = { connect: formatedData };
  } else if (type === MUTATION_TYPE.UPDATE) {
    formatedData = { reconnect: formatedData };
  }

  return formatedData;
};


export { formatRelationReferenceForMutation };
