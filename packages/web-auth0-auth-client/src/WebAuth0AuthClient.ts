import * as auth0 from 'auth0-js';
import * as R from 'ramda';
import {
  throwIfMissingRequiredParameters,
  StorageAPI,
  PACKAGES,
  IAuthState,
  IAuthClient,
  IStorage,
  IStorageOptions,
} from '@8base/utils';

export interface IAuth0Data {
  state?: object;
  isEmailVerified: boolean;
  idToken: string;
  email: string;
  idTokenPayload: any;
}

export interface IAuth0ClientOptions {
  domain: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  audience?: string;
  responseType?: string;
  responseMode?: string;
}

export interface IWebAuth0AuthClientOptions extends IAuth0ClientOptions {
  logoutRedirectUri?: string;
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

  private logoutHasCalled: boolean;
  private readonly logoutRedirectUri?: string;
  private storageAPI: StorageAPI<IAuthState>;

  constructor(options: IWebAuth0AuthClientOptions, storageOptions: IStorageOptions<IAuthState> = {}) {
    throwIfMissingRequiredParameters(['domain', 'clientId', 'redirectUri'], PACKAGES.WEB_AUTH0_AUTH_CLIENT, options);

    const { logoutRedirectUri, clientId, ...restOptions } = options;

    this.storageAPI = new StorageAPI<IAuthState>(
      storageOptions.storage || window.localStorage,
      storageOptions.storageKey || 'auth',
      storageOptions.initialState,
    );
    this.logoutHasCalled = false;
    this.logoutRedirectUri = logoutRedirectUri;
    this.auth0 = new auth0.WebAuth({
      clientID: clientId,
      responseType: 'token id_token',
      scope: 'openid email profile',
      ...restOptions,
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
    if (!this.logoutHasCalled) {
      // @ts-ignore
      this.auth0.authorize({
        ...options,
      });
    }
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
    window.addEventListener('unload', () => {
      this.purgeState();
    });

    this.logoutHasCalled = true;

    this.auth0.logout({
      returnTo: this.logoutRedirectUri,
      ...options,
    });
  }
}

export { WebAuth0AuthClient };
