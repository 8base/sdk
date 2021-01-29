import React, { useContext } from 'react';
import * as R from 'ramda';

import { PermissionsContext } from './PermissionsContext';
import { isAllowed } from './isAllowed';
import { PermissionsContextValue } from './types';

type IfAllowedProps = {
  permissions: string[][];
  children: React.ReactNode;
};

const IfAllowed = ({ children, permissions }: IfAllowedProps) => {
  const context: PermissionsContextValue = useContext(PermissionsContext);

  let allowed = true;
  let result;

  result = permissions.map(([type, resource, permission]) => ({
    allowed: isAllowed(
      {
        permission,
        resource,
        type,
      },
      context.permissions,
    ),
    fields: R.pathOr({}, [type, resource, 'permission', permission, 'fields'], context.permissions),
  }));

  allowed = R.all(R.propEq('allowed', true), result);

  if (typeof children === 'function') {
    return children(allowed, result);
  }

  return allowed ? children : null;
};

export { IfAllowed };
