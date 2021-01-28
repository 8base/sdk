import React from 'react';
import { PermissionsContextValue } from './types';

const PermissionsContext = React.createContext<PermissionsContextValue>({
  permissions: {},
  roles: [],
});

export { PermissionsContext };
