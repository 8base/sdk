//@flow
import { MUTATION_TYPE } from '../constants';
import { isListField } from '../verifiers';
import type { FieldSchema, MutationType } from '../types';

const formatRelationReferenceForMutation = (type: MutationType, fieldSchema: FieldSchema, data: Object) => {
  let formatedData = data;

  if (isListField(fieldSchema)) {
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


export { formatRelationReferenceForMutation };
