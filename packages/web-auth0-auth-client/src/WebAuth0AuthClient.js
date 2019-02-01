// @flow
import auth0 from 'auth0-js';
import * as R from 'ramda';
import type {
  AuthState,
  AuthData,
  AuthClient,
  Authorizable,
} from '@8base/utils';

import * as localStorageAccessor from './localStorageAccessor';

export type WebAuth0AuthClientOptions = {
  domain: string,
  clientId: string,
  redirectUri: string,
  workspaceId?: string,
  logoutRedirectUri?: string,
};

const isEmptyOrNil = R.either(
  R.isNil,
  R.isEmpty,
);

const isEmailVerified = R.pipe(
  R.path(['idTokenPayload', 'email_verified']),
  R.equals(true),
);

const getEmail = R.path(['idTokenPayload', 'email']);

const getIdToken = R.path(['idToken']);

const getIdTokenPayload = R.prop('idTokenPayload');

const getState = R.pipe(
  R.prop('state'),
  (state) => {
    try {
      return JSON.parse(state);
    } catch (e) {
      return state;
    }
  },
);


/**
 * Create instacne of the web auth0 auth client.
 * @param {string} workspaceId Identifier of the 8base app workspace.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientId Client id. See auth0 documentation.
 * @param {string} redirectUri Redurect uri. See auth0 documentation.
 */
class WebAuth0AuthClient implements AuthClient, Authorizable {
  auth0: auth0.WebAuth;
  workspaceId: string | void;
  logoutRedirectUri: string | void;

  constructor({ domain, clientId, redirectUri, workspaceId, logoutRedirectUri }: WebAuth0AuthClientOptions) {

    this.workspaceId = workspaceId;
    this.logoutRedirectUri = logoutRedirectUri;
    this.auth0 = new auth0.WebAuth({
      domain,
      clientID: clientId,
      redirectUri,
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
      state: this.getAuthorizeState(),
    });
  }

  getAuthorizeState() {
    return this.workspaceId
      ? JSON.stringify({ workspaceId: this.workspaceId })
      : undefined;
  }

  authorize = async (options?: Object = {}): Promise<void> => {
    this.auth0.authorize({
      state: this.getAuthorizeState(),
      ...options,
    });
  };

  renewToken = (options?: Object = {}): Promise<AuthData> => new Promise((resolve, reject) => {
    this.auth0.checkSession(options, (error, result) => {
      if (error) {
        reject(error || {});
        return;
      }

      resolve({
        state: getState(result),
        email: getEmail(result),
        idToken: getIdToken(result),
        isEmailVerified: isEmailVerified(result),
        idTokenPayload: getIdTokenPayload(result),
      });
    });
  });


  changePassword = async (): Promise<{ email: string }> => {
    const { email } = await this.getAuthState();

    return new Promise((resolve, reject) => {
      this.auth0.changePassword({
        connection: 'Username-Password-Authentication',
        email,
      }, (error) => {
        if (error) {
          reject(error || {});
          return;
        }

        resolve({ email });
      });
    });
  };

  getAuthorizedData = (): Promise<AuthData> => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((error, authResult) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          state: getState(authResult),
          email: getEmail(authResult),
          idToken: getIdToken(authResult),
          isEmailVerified: isEmailVerified(authResult),
          idTokenPayload: getIdTokenPayload(authResult),
        });
      });
    });
  }

  setAuthState = async (state: AuthState): Promise<void> => {
    localStorageAccessor.setAuthState(state);
  };

  getAuthState = async (): Promise<AuthState> => localStorageAccessor.getAuthState();

  purgeAuthState = async (): Promise<void> => {
    localStorageAccessor.purgeAuthState();
  };

  checkIsAuthorized = async (): Promise<boolean> => {
    const { token } = await this.getAuthState();

    return R.not(isEmptyOrNil(token));
  };

  logout = async (options?: Object = {}): Promise<void> => {
    this.auth0.logout({
      returnTo: this.logoutRedirectUri,
      ...options,
    });
  };
}


export { WebAuth0AuthClient };

