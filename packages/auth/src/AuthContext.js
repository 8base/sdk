// @flow

import React, { Component } from 'react';
import * as R from 'ramda';
import auth0 from 'auth0-js';

import * as localStorageAccessor from './localStorageAccessor';
import type { AuthState } from './localStorageAccessor';
import type { AuthContextProps } from './withAuth';

type AuthProviderProps = {
  children: React$Node,
  domain: string,
  clientID: string,
  redirectUri: string,
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
 */
class AuthProvider extends Component<AuthProviderProps> {
  auth0: auth0.WebAuth;

  constructor(props: AuthProviderProps) {
    super(props);

    const { domain, clientID, redirectUri } = this.props;

    this.auth0 = new auth0.WebAuth({
      domain,
      clientID,
      redirectUri,
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  }

  authorize = (...args: Array<any>): void => {
    this.auth0.authorize(...args);
  };

  logout = (options: any): void => {
    localStorageAccessor.purgeAuthState();

    this.auth0.logout({
      ...options,
    });
  };

  checkSession = (options: any): Promise<any> => new Promise((resolve, reject) => {
    this.auth0.checkSession(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

  parseHash = (): Promise<any> => new Promise((resolve, reject) => {
    this.auth0.parseHash((error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

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

  render() {
    const { children } = this.props;
    const { idToken } = this.getAuthState();
    const isAuthorized = checkIsAuthorized({ idToken });

    return (
      <Provider
        value={{
          isAuthorized,
          setAuthState: this.setAuthState,
          getAuthState: this.getAuthState,
          purgeAuthState: this.purgeAuthState,
          authorize: this.authorize,
          parseHash: this.parseHash,
          logout: this.logout,
          checkSession: this.checkSession,
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
