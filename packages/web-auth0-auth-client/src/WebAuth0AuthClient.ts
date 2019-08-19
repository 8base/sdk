import * as auth0 from 'auth0-js';
import * as R from 'ramda';
import { throwIfMissingRequiredParameters } from '@8base/utils';

import { StorageAPI, PACKAGES, IAuthState, IAuthClient, IStorage } from '@8base/utils';

interface IAuth0Data {
  state?: object;
  isEmailVerified: boolean;
  idToken: string;
  email: string;
  idTokenPayload: any;
}

interface IAuth0ClientOptions {
  domain: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  audience?: string;
  responseType?: string;
  responseMode?: string;
}

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
 * Creates instacne of the web auth0 auth client.
 */
class WebAuth0AuthClient implements IAuthClient {
  public auth0: auth0.WebAuth;

  private logoutRedirectUri?: string;
  private storageAPI: StorageAPI<IAuthState>;

  constructor(
    options: IAuth0ClientOptions,
    logoutRedirectUri?: string,
    storage: IStorage = window.localStorage,
    storageKey: string = 'auth',
  ) {
    throwIfMissingRequiredParameters(['domain', 'clientId', 'redirectUri'], PACKAGES.WEB_AUTH0_AUTH_CLIENT, options);

    const { domain, clientId, redirectUri } = options;

    this.logoutRedirectUri = logoutRedirectUri;
    this.storageAPI = new StorageAPI<IAuthState>(storage, storageKey);
    this.auth0 = new auth0.WebAuth({
      clientID: clientId,
      responseType: 'token id_token',
      scope: 'openid email profile',
      ...R.omit(['cliendId'], options),
    });
  }

  public setState(state: IAuthState): void {
    this.storageAPI.setState(state);
  }

  public getState(): IAuthState {
    return this.storageAPI.getState();
  }

  public purgeState(): void {
    this.storageAPI.purgeState();
  }

  public checkIsAuthorized(): boolean {
    const { token } = this.getState();

    return R.not(isEmptyOrNil(token));
  }

  public authorize(options: object = {}): void {
    // @ts-ignore
    this.auth0.authorize({
      ...options,
    });
  }

  public checkSession(options: object = {}): Promise<IAuth0Data> {
    return new Promise((resolve: any, reject) => {
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
  }

  public changePassword(): Promise<{ email: string }> {
    const { email = '' } = this.getState();

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
  }

  public getAuthorizedData(): Promise<IAuth0Data> {
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
  }

  public logout(options: object = {}): void {
    this.auth0.logout({
      returnTo: this.logoutRedirectUri,
      ...options,
    });
  }
}

export { WebAuth0AuthClient };
