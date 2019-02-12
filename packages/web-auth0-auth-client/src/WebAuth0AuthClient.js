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
  logoutRedirectUri?: string,
  workspaceId?: string,
  profileId?: string,
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

/**
 * Create instacne of the web auth0 auth client.
 * @param {string} workspaceId Identifier of the 8base app workspace.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientId Client id. See auth0 documentation.
 * @param {string} redirectUri Redurect uri. See auth0 documentation.
 */
class WebAuth0AuthClient implements AuthClient, Authorizable {
  auth0: auth0.WebAuth;
  logoutRedirectUri: string | void;
  workspaceId: string | void;
  profileId: string | void;

  constructor({
    domain,
    clientId,
    redirectUri,
    logoutRedirectUri,
    workspaceId,
    profileId,
  }: WebAuth0AuthClientOptions) {

    this.logoutRedirectUri = logoutRedirectUri;
    this.workspaceId = workspaceId;
    this.profileId = profileId;
    this.auth0 = new auth0.WebAuth({
      domain,
      clientID: clientId,
      redirectUri,
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  }

  authorize = async (options?: Object = {}): Promise<void> => {
    this.auth0.authorize({
      workspaceId: this.workspaceId,
      profileId: this.profileId,
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

