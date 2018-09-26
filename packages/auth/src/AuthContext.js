// @flow

import React, { Component } from 'react';
import * as R from 'ramda';

import * as localStorageAccessor from './localStorageAccessor';
import type { AuthState } from './localStorageAccessor';
import type { AuthContextProps } from './withAuth';

type AuthProviderProps = {
  children: React$Node,
};

const checkIsEmptyOrNil: (?string) => boolean = R.either(R.isNil, R.isEmpty);

const checkIsAuthorized = ({ workspaceId, idToken }: AuthState): boolean =>
  R.not(
    R.or(
      checkIsEmptyOrNil(workspaceId),
      checkIsEmptyOrNil(idToken),
    ),
  );

const { Provider, Consumer } = React.createContext({
  isAuthorized: false,
  authState: {},
});

/**
 * Provides access to the authentication state.
 */
class AuthProvider extends Component<AuthProviderProps> {
  setAuthState = (state: AuthState) => {
    localStorageAccessor.setAuthState(state);

    this.forceUpdate();
  };

  getAuthState = (): AuthState => {
    return localStorageAccessor.getAuthState();
  };

  purgeAuthState = (): void => {
    localStorageAccessor.purgeAuthState();

    this.forceUpdate();
  };

  getContextValue = R.memoize((isAuthorized) => ({
    isAuthorized,
    setAuthState: this.setAuthState,
    getAuthState: this.getAuthState,
    purgeAuthState: this.purgeAuthState,
  }));

  render() {
    const { children } = this.props;
    const { workspaceId, idToken } = this.getAuthState();
    const isAuthorized = checkIsAuthorized({ workspaceId, idToken });

    const contextValue = this.getContextValue(isAuthorized);

    return (
      <Provider value={ contextValue }>
        { children }
      </Provider>
    );
  }
}

const AuthConsumer: React$ComponentType<{ children: (AuthContextProps) => React$Node }> = (Consumer: any);

export {
  AuthProvider,
  AuthConsumer,
};
