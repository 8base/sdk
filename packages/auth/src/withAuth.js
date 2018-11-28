// @flow

import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AuthConsumer } from './AuthContext';
import type { AuthState, AuthContextProps } from './types';


type WithAuthProps = {
  authState: AuthState,
} & AuthContextProps

interface AuthProps {
  auth: WithAuthProps,
}

const withAuth: any = <InputProps: {}>(
  WrappedComponent: React$ComponentType<AuthProps & InputProps>,
): React$ComponentType<InputProps> => {
  class WithAuth extends React.Component<InputProps> {
    render() {
      return (
        <AuthConsumer>
          {
            ({
              isAuthorized,
              getAuthState,
              setAuthState,
              purgeAuthState,
              authorize,
              getAuthorizedData,
              checkSession,
              logout,
            }: AuthContextProps) => (
              <WrappedComponent { ...this.props } auth={{
                isAuthorized,
                setAuthState,
                purgeAuthState,
                getAuthState,
                authState: getAuthState(),
                authorize,
                getAuthorizedData,
                checkSession,
                logout,
              }} />
            )
          }
        </AuthConsumer>
      );
    }
  }
  const wrappedDisplayName: string = wrapDisplayName(WrappedComponent, 'withAuth');

  return setDisplayName(wrappedDisplayName)(WithAuth);
};

export { withAuth };

export type { AuthContextProps, AuthProps, WithAuthProps };
