import * as R from 'ramda';

export const isAllowed = ({
  resource,
  type,
  permission,
} = {}, permissions) => R.pathOr(
  false,
  [type, resource, 'permission', permission, 'allow'],
  permissions,
);
