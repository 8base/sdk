import React from 'react';
import { AuthState, IAuthClient, IAuthorizable, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: React.ReactNode;
  authClient: IAuthClient & IAuthorizable;
};

type AuthProviderState = {
  isAuthorized: boolean;
  authState: AuthState;
};

/**
 * Provides access to the authentication state.
 * @property {React$Node} children Children of the provider.
 * @property {IAuthClient} authClient Instance of the auth client.
 */
class AuthProvider extends React.Component<AuthProviderProps, AuthProviderState> {
  constructor(props: AuthProviderProps) {
    super(props);

    if (props.authClient === undefined || props.authClient === null) {
      throw new SDKError(
        ERROR_CODES.MISSING_PARAMETER,
        PACKAGES.AUTH,
        'Property authClient in the AuthProvider should be specified',
      );
    }

    this.state = {
      authState: {},
      isAuthorized: false,
    };
  }

  public updateState = async () => {
    const { authClient } = this.props;

    const isAuthorized = await authClient.checkIsAuthorized();
    const authState = await authClient.getAuthState();

    this.setState({ isAuthorized, authState });
  };

  public async componentDidMount() {
    await this.updateState();
  }

  public setAuthState = async (state: AuthState): Promise<void> => {
    const { authClient } = this.props;

    await authClient.setAuthState(state);
    await this.updateState();
  };

  public purgeAuthState = async (): Promise<void> => {
    const { authClient } = this.props;

    await authClient.purgeAuthState();

    await this.updateState();
  };

  public render() {
    const { children, authClient } = this.props;
    const { isAuthorized, authState } = this.state;

    return (
      <AuthContext.Provider
        value={{
          ...authClient,
          authState,
          isAuthorized,
          purgeAuthState: this.purgeAuthState,
          setAuthState: this.setAuthState,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export { AuthProvider };
