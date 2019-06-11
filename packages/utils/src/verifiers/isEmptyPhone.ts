import * as R from 'ramda';

const isEmpty = R.anyPass([R.isEmpty, R.isNil]);

export const isEmptyPhone = R.anyPass([
  isEmpty,
  R.allPass([R.propSatisfies(isEmpty, 'code'), R.propSatisfies(isEmpty, 'number')]),
]);
