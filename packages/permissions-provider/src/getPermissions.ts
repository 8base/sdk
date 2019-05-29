import * as R from 'ramda';

export const getPermissions = R.pipe(
  R.pathOr([], ['user']),
  R.pipe(
    R.pathOr([], ['permissions', 'items']),
    R.groupBy(R.prop('resourceType')),
    R.mapObjIndexed(R.indexBy(R.prop('resource'))),
  ),
);

