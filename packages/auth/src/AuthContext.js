// @flow

import React, { Component } from 'react';
import * as R from 'ramda';

import type { AuthState, AuthClient, AuthContextProps } from './types';

type AuthProviderProps = {
  children: React$Node,
  authClient: AuthClient,
};

const isEmptyOrNil: (?string) => boolean = R.either(R.isNil, R.isEmpty);

const checkIsAuthorized = ({ idToken }: AuthState): boolean =>
  R.not(isEmptyOrNil(idToken));

const { Provider, Consumer } = React.createContext({
  isAuthorized: false,
  authState: {},
});

/**
 * Provides access to the authentication state.
 * @property {React$Node} children Children of the provider.
 * @property {AuthClient} authClient Instance of the auth client.
 */
class AuthProvider extends Component<AuthProviderProps> {

  setAuthState = (state: AuthState) => {
    this.props.authClient.setAuthState(state);
    this.forceUpdate();
  };

  purgeAuthState = (): void => {
    this.props.authClient.purgeAuthState();
    this.forceUpdate();
  };

  render() {
    const { children, authClient } = this.props;
    const { getAuthState, authorize, getAuthorizedData, logout, checkSession } = authClient;
    const { idToken } = getAuthState();
    const isAuthorized = checkIsAuthorized({ idToken });

    return (
      <Provider
        value={{
          isAuthorized,
          setAuthState: this.setAuthState,
          purgeAuthState: this.purgeAuthState,
          getAuthState,
          authorize,
          getAuthorizedData,
          logout,
          checkSession,
        }}
      >
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
