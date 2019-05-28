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

    if (props.authClient === undefined || props.authClient === null) {
      throw new Error('Property authClient in the AuthProvider should be specified');
    }

    this.state = {
      isAuthorized: false,
      authState: {},
    };
  }

  updateState = async () => {
    const { authClient } = this.props;

    const isAuthorized = await authClient.checkIsAuthorized();
    const authState = await authClient.getAuthState();

    this.setState({ isAuthorized, authState });
  };

  async componentDidMount() {
    await this.updateState();
  }

  setAuthState = async (state: AuthState): Promise<void> => {
    const { authClient } = this.props;

    await authClient.setAuthState(state);
    await this.updateState();
  };

  purgeAuthState = async (): Promise<void> => {
    const { authClient } = this.props;

    await authClient.purgeAuthState();

    await this.updateState();
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
