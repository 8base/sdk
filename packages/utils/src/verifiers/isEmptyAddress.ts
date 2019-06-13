import * as R from 'ramda';

const isEmpty = R.anyPass([R.isEmpty, R.isNil]);

export const isEmptyAddress = R.anyPass([
  isEmpty,
  R.allPass([
    R.propSatisfies(isEmpty, 'street1'),
    R.propSatisfies(isEmpty, 'street2'),
    R.propSatisfies(isEmpty, 'zip'),
    R.propSatisfies(isEmpty, 'city'),
    R.propSatisfies(isEmpty, 'state'),
    R.propSatisfies(isEmpty, 'country'),
  ]),
]);
