// @flow

import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AuthConsumer } from './AuthContext';
import type { AuthState } from './localStorageAccessor';


/**
 * Authentication context
 */
interface AuthContextProps {
  isAuthorized?: boolean,
  authState?: AuthState,
  setAuthState?: (AuthState) => void,
}

interface AuthProps {
  auth: AuthContextProps,
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
            (auth: AuthContextProps) => (
              <WrappedComponent { ...this.props } auth={ auth } />
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
