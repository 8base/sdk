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

const checkIsAuthorized = ({ accountId, idToken }: AuthState): boolean =>
  R.not(
    R.or(
      checkIsEmptyOrNil(accountId),
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
  }

  getAuthState = (): AuthState => {
    return localStorageAccessor.getAuthState();
  }

  render() {
    const { children } = this.props;
    const { accountId, idToken } = this.getAuthState();
    const isAuthorized = checkIsAuthorized({ accountId, idToken });

    return (
      <Provider value={{
        isAuthorized,
        setAuthState: this.setAuthState,
        getAuthState: this.getAuthState,
      }}>
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
