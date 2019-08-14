import React from 'react';
import { AuthState, IAuthClient, IAuthorizable } from '@8base/utils';

export type AuthContextProps = IAuthClient &
  IAuthorizable & {
    isAuthorized: boolean;
    authState: AuthState;
  };

const AuthContext = React.createContext<AuthContextProps>({
  authState: {},
  isAuthorized: false,
} as any);

export { AuthContext };
