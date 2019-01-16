import * as R from 'ramda';

export const getPermissions = R.pipe(
  R.pathOr([], ['user', 'roles', 'items']),
  R.map(
    R.pipe(
      R.pathOr([], ['permissions', 'items']),
      R.groupBy(R.prop('resourceType')),
      R.mapObjIndexed(R.indexBy(R.prop('resource'))),
    ),
  ),
  R.reduce((result, value) => R.mergeDeepWithKey((key, left, right) => right || left, result, value), {}),
);
