import * as R from 'ramda';

export const isEmptyNumber = R.anyPass([R.isEmpty, R.isNil]);
