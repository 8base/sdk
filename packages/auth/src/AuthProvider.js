// @flow

import React from 'react';
import type { AuthState, AuthClient, Authorizable } from '@8base/utils';

import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: React$Node,
  authClient: AuthClient & (Authorizable | {}),
};

type AuthProviderState = {
  isAuthorized: boolean,
  authState: AuthState,
};

/**
 * Provides access to the authentication state.
 * @property {React$Node} children Children of the provider.
 * @property {AuthClient} authClient Instance of the auth client.
 */
class AuthProvider extends React.Component<AuthProviderProps, AuthProviderState> {

  constructor(props: AuthProviderProps) {
    super(props);

    this.state = {
      isAuthorized: false,
      authState: {},
    };
  }

  async componentDidMount() {
    const { authClient } = this.props;

    const isAuthorized = await authClient.checkIsAuthorized();
    const authState = await authClient.getAuthState();

    this.setState({ isAuthorized, authState });
  }

  setAuthState = async (state: AuthState): Promise<void> => {
    const { authClient } = this.props;

    await authClient.setAuthState(state);

    const isAuthorized = await authClient.checkIsAuthorized();
    const authState = await authClient.getAuthState();

    this.setState({ isAuthorized, authState });
  };

  purgeAuthState = async (): Promise<void> => {
    const { authClient } = this.props;

    await authClient.purgeAuthState();

    const isAuthorized = await authClient.checkIsAuthorized();
    const authState = await authClient.getAuthState();

    this.setState({ isAuthorized, authState });
  };

  render() {
    const { children, authClient } = this.props;
    const { isAuthorized, authState } = this.state;

    return (
      <AuthContext.Provider
        value={{
          ...authClient,
          setAuthState: this.setAuthState,
          purgeAuthState: this.purgeAuthState,
          isAuthorized,
          authState,
        }}
      >
        { children }
      </AuthContext.Provider>
    );
  }
}

export { AuthProvider };
