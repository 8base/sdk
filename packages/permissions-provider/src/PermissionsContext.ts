import React from 'react';
import { TransformedPermissions } from './types';

const PermissionsContext = React.createContext<TransformedPermissions>({});

export { PermissionsContext };
