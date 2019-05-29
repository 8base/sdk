import * as R from 'ramda';
import { TransformedPermissions } from './types';

type IsAllowedArgs = {
  resource: string,
  type: string,
  permission: string,
  field?: any,
}

export const isAllowed = ({
  resource,
  type,
  permission,
  field,
}: IsAllowedArgs, permissions: TransformedPermissions) => {
  const path: string[] = [type, resource, 'permission', permission, 'allow'];

  if (field) {
    path.pop();
    path.push('fields', field);
  }

  return R.pathOr(false, path, permissions);
};
