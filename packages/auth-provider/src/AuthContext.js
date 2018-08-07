// @flow

import React, { Component } from 'react';
import * as R from 'ramda';

import * as localStorageAccessor from './localStorageAccessor';
import type { AuthState } from './localStorageAccessor';
export type { AuthContextProps } from './withAuth';

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

const { Provider, Consumer: AuthConsumer } = React.createContext({
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

  render() {
    const { children } = this.props;
    const authState = localStorageAccessor.getAuthState();
    const { accountId, idToken } = authState;
    const isAuthorized = checkIsAuthorized({ accountId, idToken });

    return (
      <Provider value={{
        authState,
        isAuthorized,
        setAuthState: this.setAuthState,
      }}>
        { children }
      </Provider>
    );
  }
}

export {
  AuthProvider,
  AuthConsumer,
};
