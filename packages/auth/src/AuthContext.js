// @flow

import React, { Component } from 'react';

import type {
  AuthState,
  AuthClient,
  AuthContextProps,
} from './types';

type AuthProviderProps = {
  children: React$Node,
  authClient: AuthClient,
};

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
    const isAuthorized = authClient.checkIsAuthorized();

    return (
      <Provider
        value={{
          ...authClient,
          setAuthState: this.setAuthState,
          purgeAuthState: this.purgeAuthState,
          isAuthorized,
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
