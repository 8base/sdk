import * as auth0 from 'auth0-js';
import * as R from 'ramda';
import { throwIfMissingRequiredOption } from '@8base/utils';

import {
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
  logoutRedirectUri: string,
  workspaceId?: string,
  profile?: {
    id: string,
    isDefault: boolean,
  },
  apiEndpoint?: string,
};

const DEFAULT_8BASE_API_ENDPOINT = 'https://api.8base.com/';

const isEmptyOrNil = R.either(
  R.isNil,
  R.isEmpty,
);

const isEmailVerified = R.pipe(
  R.pathOr(undefined, ['idTokenPayload', 'email_verified']),
  R.equals(true),
);

const getEmail = R.path(['idTokenPayload', 'email']);

const getIdToken = R.path(['idToken']);

const getIdTokenPayload = R.propOr(undefined, 'idTokenPayload');

const getState = R.propOr(undefined, 'state');

const get8baseRedirectUri = (
  originalRedirectUri: string,
  workspaceId: string,
  apiEndpoint: string = DEFAULT_8BASE_API_ENDPOINT,
): string => {
  const encodedOriginalRedirectUri = encodeURIComponent(originalRedirectUri);
  const encodedWorkspaceId = encodeURIComponent(workspaceId);

  return (new URL(
    `/authRedirect?redirectUrl=${encodedOriginalRedirectUri}&workspace=${encodedWorkspaceId}`,
    apiEndpoint,
  )).toString();
};

/**
 * Create instacne of the web auth0 auth client.
 * @param {string} workspaceId Identifier of the 8base app workspace.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientId Client id. See auth0 documentation.
 * @param {string} redirectUri Redurect uri. See auth0 documentation.
 */
class WebAuth0AuthClient implements AuthClient, Authorizable {
  auth0: auth0.WebAuth;
  logoutRedirectUri?: string;
  workspaceId?: string;
  profileId?: string;

  constructor(options: WebAuth0AuthClientOptions) {
    throwIfMissingRequiredOption([
      'domain', 'clientId', 'redirectUri', 'logoutRedirectUri',
    ], options);

    const {
      domain,
      clientId,
      profile,
      workspaceId,
      apiEndpoint,
    } = options;
    let { redirectUri, logoutRedirectUri } = options;

    if (profile) {
      throwIfMissingRequiredOption([
        'workspaceId',
        ['profile', 'id'],
      ], options);

      this.workspaceId = workspaceId;
      this.profileId = profile.id;

      if (profile.isDefault && workspaceId) {
        redirectUri = get8baseRedirectUri(
          redirectUri,
          workspaceId,
          apiEndpoint,
        );

        logoutRedirectUri = get8baseRedirectUri(
          logoutRedirectUri,
          workspaceId,
          apiEndpoint,
        );
      }
    }

    this.logoutRedirectUri = logoutRedirectUri;
    this.auth0 = new auth0.WebAuth({
      domain,
      clientID: clientId,
      redirectUri,
      // @ts-ignore Check typings. WebAuth options has no mustAcceptTerms property!
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  }

  // @ts-ignore Check this logic. Why in the interface defines Promise<AuthData> in return value?
  authorize = async (options: Object = {}): Promise<void> => {
    this.auth0.authorize({
      // @ts-ignore Check typings. Authorize options has no workspaceId property!
      workspaceId: this.workspaceId,
      profileId: this.profileId,
      ...options,
    });
  };

  renewToken = (options: Object = {}): Promise<AuthData> => new Promise((resolve: any, reject) => {
    this.auth0.checkSession(options, (error, result: any) => {
      if (error) {
        reject(error || {});
        return;
      }

      resolve({
        email: getEmail(result),
        idToken: getIdToken(result),
        isEmailVerified: isEmailVerified(result),
        idTokenPayload: getIdTokenPayload(result),
        state: getState(result),
      });
    });
  });


  changePassword = async (): Promise<{ email: string }> => {
    const { email = '' } = await this.getAuthState();

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
    return new Promise((resolve: Function, reject) => {
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
          state: getState(authResult),
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

  logout = async (options: Object = {}): Promise<void> => {
    this.auth0.logout({
      returnTo: this.logoutRedirectUri,
      ...options,
    });
  };
}


export { WebAuth0AuthClient };

