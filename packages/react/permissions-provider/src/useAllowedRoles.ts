import React, { useContext } from 'react';
import * as R from 'ramda';

import { PermissionsContext } from './PermissionsContext';
import { PermissionsContextValue } from './types';

export const useAllowedRoles = (roles: string[]) => {
  const context: PermissionsContextValue = useContext(PermissionsContext);

  const allowed: boolean = R.intersection(roles, context.roles).length !== 0;

  return allowed;
};
