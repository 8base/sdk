import React from 'react';

import { useAllowedRoles } from './useAllowedRoles';

type IfAllowedRolesProps = {
  roles: string[];
  children: React.ReactNode;
};

const IfAllowedRoles = ({ children, roles = [] }: IfAllowedRolesProps) => {
  const allowed = useAllowedRoles(roles);

  if (typeof children === 'function') {
    return children(allowed);
  }

  return allowed ? children : null;
};

export { IfAllowedRoles };
