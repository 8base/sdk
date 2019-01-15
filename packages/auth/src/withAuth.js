// @flow

import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AuthConsumer } from './AuthContext';
import type { AuthState, AuthContextProps } from './types';

type WithAuthProps = {
  authState: AuthState,
} & AuthContextProps

type AuthProps = {
  auth: WithAuthProps,
};

const withAuth: any = <InputProps: {}>(
  WrappedComponent: React$ComponentType<AuthProps & InputProps>,
): React$ComponentType<InputProps> => {
  class WithAuth extends React.Component<InputProps> {
    render() {
      return (
        <AuthConsumer>
          { (contextProps: AuthContextProps) => (
            <WrappedComponent
              { ...this.props }
              auth={{
                ...contextProps,
                authState: contextProps.getAuthState(),
              }}
            />
          ) }
        </AuthConsumer>
      );
    }
  }
  const wrappedDisplayName: string = wrapDisplayName(WrappedComponent, 'withAuth');

  return setDisplayName(wrappedDisplayName)(WithAuth);
};

export { withAuth };

export type { AuthContextProps, AuthProps, WithAuthProps };
