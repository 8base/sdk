// @flow

import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AuthConsumer } from './AuthContext';
import type { AuthState } from './localStorageAccessor';


/**
 * Authentication context
 */
interface AuthContextProps {
  isAuthorized: boolean,
  getAuthState: () => AuthState,
  setAuthState: (AuthState) => void,
  purgeAuthState: () => void,
}

interface WithAuthProps {
  isAuthorized: boolean,
  authState: AuthState,
  setAuthState: (AuthState) => void,
  purgeAuthState: () => void,
}

interface AuthProps {
  auth: WithAuthProps,
}

/**
 * Hoc to pass auth state to the component
 *
 * @param {AuthContextProps} auth Auth state passed by the props.
 */
const withAuth: any = <InputProps: {}>(
  WrappedComponent: React$ComponentType<AuthProps & InputProps>,
): React$ComponentType<InputProps> => {
  class WithAuth extends React.Component<InputProps> {
    render() {
      return (
        <AuthConsumer>
          {
            ({ isAuthorized, getAuthState, setAuthState, purgeAuthState }: AuthContextProps) => (
              <WrappedComponent { ...this.props } auth={{
                isAuthorized,
                setAuthState,
                purgeAuthState,
                authState: getAuthState(),
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

export type { AuthContextProps };
