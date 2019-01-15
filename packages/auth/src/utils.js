import * as R from 'ramda';

export const isEmptyOrNil: (?string) => boolean = R.either(R.isNil, R.isEmpty);

