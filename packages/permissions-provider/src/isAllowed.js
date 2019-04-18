import * as R from 'ramda';

export const isAllowed = ({
  resource,
  type,
  permission,
  field,
} = {}, permissions) => {
  const path = [type, resource, 'permission', permission, 'allow'];

  if (field) {
    path.pop();
    path.push('fields', field);
  }

  return R.pathOr(false, path, permissions);
};
