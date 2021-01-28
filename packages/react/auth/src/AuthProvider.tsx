import React from 'react';
import { IAuthState, SDKError, ERROR_CODES, PACKAGES, Unsubscribe } from '@8base/utils';
import { ISubscribableAuthClient, SubscribableDecorator } from '@8base/auth';

import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: React.ReactNode;
  authClient: ISubscribableAuthClient;
};

type AuthProviderState = {
  isAuthorized: boolean;
  isEmailVerified?: boolean;
  authState: IAuthState;
};

/**
 * Provides access to the authentication state.
 * @property {React$Node} children Children of the provider.
 * @property {IAuthClient} authClient Instance of the auth client.
 */
class AuthProvider extends React.Component<AuthProviderProps, AuthProviderState> {
  private unsubscribe: Unsubscribe | null;

  constructor(props: AuthProviderProps) {
    super(props);

    if (props.authClient === undefined || props.authClient === null) {
      throw new SDKError(
        ERROR_CODES.MISSING_PARAMETER,
        PACKAGES.REACT_AUTH,
        'Property authClient in the AuthProvider should be specified',
      );
    }

    if (!SubscribableDecorator.hasConflicts(props.authClient)) {
      throw new SDKError(
        ERROR_CODES.INVALID_ARGUMENT,
        PACKAGES.REACT_AUTH,
        'authClient should has ability to notify about state changes',
      );
    }

    this.state = {
      authState: {},
      isAuthorized: false,
    };

    this.unsubscribe = null;
  }

  public updateState = () => {
    const { authClient } = this.props;

    const authState = authClient.getState();
    const isAuthorized = authClient.checkIsAuthorized();
    const isEmailVerified =
      authClient.checkIsEmailVerified && (authClient.checkIsEmailVerified() as boolean | undefined);

    this.setState({ isAuthorized, isEmailVerified, authState });
  };

  public componentDidMount() {
    this.unsubscribe = this.props.authClient.subscribe(() => {
      this.updateState();
    });

    this.updateState();
  }

  public componentDidUpdate(prevProps: AuthProviderProps) {
    if (prevProps.authClient !== this.props.authClient) {
      this.unsubscribe = this.props.authClient.subscribe(() => {
        this.updateState();
      });
    }
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  public render() {
    const { children, authClient } = this.props;
    const { isAuthorized, isEmailVerified, authState } = this.state;

    return (
      <AuthContext.Provider
        value={{
          authClient,
          authState,
          isAuthorized,
          isEmailVerified,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export { AuthProvider };
