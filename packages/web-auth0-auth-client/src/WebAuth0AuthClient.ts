import * as auth0 from 'auth0-js';
import R from 'ramda';
import { throwIfMissingRequiredParameters } from '@8base/utils';

import { AuthState, AuthData, IAuthClient, IAuthorizable, PACKAGES } from '@8base/utils';

import * as localStorageAccessor from './localStorageAccessor';

export type WebAuth0AuthClientOptions = {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri: string;
};

const DEFAULT_8BASE_API_ENDPOINT = 'https://api.8base.com/';

const isEmptyOrNil = R.either(R.isNil, R.isEmpty);

const isEmailVerified = R.pipe(
  R.pathOr(undefined, ['idTokenPayload', 'email_verified']),
  R.equals(true),
);

const getEmail = R.path(['idTokenPayload', 'email']);

const getIdToken = R.path(['idToken']);

const getIdTokenPayload = R.propOr(undefined, 'idTokenPayload');

const getState = R.propOr(undefined, 'state');

/**
 * Create instacne of the web auth0 auth client.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientId Client id. See auth0 documentation.
 * @param {string} redirectUri Redurect uri. See auth0 documentation.
 */
class WebAuth0AuthClient implements IAuthClient, IAuthorizable {
  public auth0: auth0.WebAuth;
  public logoutRedirectUri?: string;

  constructor(options: WebAuth0AuthClientOptions) {
    throwIfMissingRequiredParameters(
      ['domain', 'clientId', 'redirectUri', 'logoutRedirectUri'],
      PACKAGES.WEB_AUTH0_AUTH_CLIENT,
      options,
    );

    const { domain, clientId, redirectUri, logoutRedirectUri } = options;

    this.logoutRedirectUri = logoutRedirectUri;
    this.auth0 = new auth0.WebAuth({
      clientID: clientId,
      domain,
      // @ts-ignore Check typings. WebAuth options has no mustAcceptTerms property!
      mustAcceptTerms: true,
      redirectUri,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  }

  // @ts-ignore Check this logic. Why in the interface defines Promise<AuthData> in return value?
  public authorize = async (options: object = {}): Promise<void> => {
    // @ts-ignore
    this.auth0.authorize({
      ...options,
    });
  };

  public renewToken = (options: object = {}): Promise<AuthData> =>
    new Promise((resolve: any, reject) => {
      this.auth0.checkSession(options, (error, result: any) => {
        if (error) {
          reject(error || {});
          return;
        }

        resolve({
          email: getEmail(result),
          idToken: getIdToken(result),
          idTokenPayload: getIdTokenPayload(result),
          isEmailVerified: isEmailVerified(result),
          state: getState(result),
        });
      });
    });

  public changePassword = async (): Promise<{ email: string }> => {
    const { email = '' } = await this.getAuthState();

    return new Promise((resolve, reject) => {
      this.auth0.changePassword(
        {
          connection: 'Username-Password-Authentication',
          email,
        },
        error => {
          if (error) {
            reject(error || {});
            return;
          }

          resolve({ email });
        },
      );
    });
  };

  public getAuthorizedData = (): Promise<AuthData> => {
    return new Promise((resolve: Function, reject) => {
      this.auth0.parseHash((error, authResult) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          email: getEmail(authResult),
          idToken: getIdToken(authResult),
          idTokenPayload: getIdTokenPayload(authResult),
          isEmailVerified: isEmailVerified(authResult),
          state: getState(authResult),
        });
      });
    });
  };

  public setAuthState = async (state: AuthState): Promise<void> => {
    localStorageAccessor.setAuthState(state);
  };

  public getAuthState = async (): Promise<AuthState> => localStorageAccessor.getAuthState();

  public purgeAuthState = async (): Promise<void> => {
    localStorageAccessor.purgeAuthState();
  };

  public checkIsAuthorized = async (): Promise<boolean> => {
    const { token } = await this.getAuthState();

    return R.not(isEmptyOrNil(token));
  };

  public logout = async (options: object = {}): Promise<void> => {
    this.auth0.logout({
      returnTo: this.logoutRedirectUri,
      ...options,
    });
  };
}

export { WebAuth0AuthClient };
