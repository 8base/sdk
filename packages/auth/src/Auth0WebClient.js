// @flow
import { path, equals, pipe } from 'ramda';
import auth0 from 'auth0-js';
import * as localStorageAccessor from './localStorageAccessor';
import type { AuthState, AuthClient, Auth0WebClientOptions } from './types';


const isEmailVerified = pipe(
  path(['idTokenPayload', 'email_verified']),
  equals(true),
);

const getEmail = path(['idTokenPayload', 'email']);

const getIdToken = path(['idToken']);

const getState = ({ state }) => {
  try {
    return JSON.parse(state);
  } catch (e) {
    return state;
  }
};


/**
 * Create instacne of the auth web zero0 client.
 * @param {string} workspaceId Identifier of the 8base app workspace.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientID Client id. See auth0 documentation.
 * @param {string} redirectUri Redurect uri. See auth0 documentation.
 */
class Auth0WebClient implements AuthClient {
  auth0: auth0.WebAuth;
  workspaceId: string | void;
  logoutRedirectUri: string | void;

  constructor({ domain, clientID, redirectUri, workspaceId, logoutRedirectUri }: Auth0WebClientOptions) {

    this.workspaceId = workspaceId;
    this.logoutRedirectUri = logoutRedirectUri;
    this.auth0 = new auth0.WebAuth({
      domain,
      clientID,
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

  authorize = (options: Object): void => {
    this.auth0.authorize({
      state: this.getAuthorizeState(),
      ...options,
    });
  };

  logout = (options: Object): void => {
    localStorageAccessor.purgeAuthState();

    this.auth0.logout({
      returnTo: this.logoutRedirectUri,
      ...options,
    });
  };

  checkSession = (options?: Object = {}): Promise<{ idToken: string }> => new Promise((resolve, reject) => {
    this.auth0.checkSession(options, (error, result: { idToken: string }) => {
      if (error) {
        reject(error || {});
        return;
      }

      resolve(result || {});
    });
  });


  changePassword = (): Promise<{ email: string }> => new Promise((resolve, reject) => {
    const { email } = this.getAuthState();

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

  getAuthorizedData = (): Promise<{ isEmailVerified: boolean, idToken: string, email: string }> => {
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
        });
      });
    });
  }

  setAuthState = (state: AuthState) => {
    localStorageAccessor.setAuthState(state);
  };

  getAuthState = (): AuthState => {
    return localStorageAccessor.getAuthState();
  };

  purgeAuthState = (): void => {
    localStorageAccessor.purgeAuthState();
  };
}


export {
  Auth0WebClient,
};