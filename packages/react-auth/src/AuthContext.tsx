import React from 'react';
import { IAuthState } from '@8base/utils';
import { ISubscribableAuthClient } from '@8base/auth';

export type AuthContextProps = {
  isAuthorized: boolean;
  authState: IAuthState;
  authClient: ISubscribableAuthClient;
};

const AuthContext = React.createContext<AuthContextProps>({
  authState: {},
  isAuthorized: false,
} as any);

export { AuthContext };
