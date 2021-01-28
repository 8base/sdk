import { useContext } from 'react';

import { PermissionsContext } from './PermissionsContext';

function usePermissions() {
  const permissions = useContext(PermissionsContext);

  return permissions;
}

export { usePermissions };
