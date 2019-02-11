// @flow
import { AuthSession } from 'expo';
import jwtDecode from 'jwt-decode';
import * as R from 'ramda';
import type {
  AuthState,
  AuthData,
  AuthClient,
  Authorizable,
} from '@8base/utils';

import * as asyncStorageAccessor from './asyncStorageAccessor';

type ReactNativeAuth0AuthClientOptions = {
  clientId: string,
  domain: string,
  workspaceId?: string,
  profileId?: string,
};

const toQueryString = R.pipe(
  R.mapObjIndexed(
    (value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
  ),
  R.values,
  R.join('&'),
);

const isEmptyOrNil = R.either(
  R.isNil,
  R.isEmpty,
);

const getError = R.path(['params', 'error']);

const getErrorDescription = R.path(['params', 'error_description']);

const getIdToken = R.path(['params', 'id_token']);

const getEmail = R.path(['email']);

const isEmailVerified = R.path(['email_verified']);

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

const prepareState = ({ workspaceId, profileId }) => {
  const state = JSON.stringify({ workspaceId, profileId });

  return state === '{}' ? undefined : state;
};

/**
 * Create instacne of the react-native auth0 auth client.
 * @param {string} workspaceId Identifier of the 8base app workspace.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientId Client id. See auth0 documentation.
 */
class ReactNativeAuth0AuthClient implements AuthClient, Authorizable {
  clientId: string;
  domain: string;
  workspaceId: string | void;
  profileId: string | void;

  constructor({ clientId, domain, workspaceId, profileId }: ReactNativeAuth0AuthClientOptions) {
    this.clientId = clientId;
    this.domain = domain;
    this.workspaceId = workspaceId;
    this.profileId = profileId;
  }

  setAuthState = async (state: AuthState): Promise<void> => {
    await asyncStorageAccessor.setAuthState(state);
  };

  getAuthState = async (): Promise<AuthState> => asyncStorageAccessor.getAuthState();

  purgeAuthState = async (): Promise<void> => {
    await asyncStorageAccessor.purgeAuthState();
    AuthSession.dismiss();
  };

  checkIsAuthorized = async (): Promise<boolean> => {
    const { token } = await asyncStorageAccessor.getAuthState();

    return R.not(isEmptyOrNil(token));
  };

  authorize = async (options?: Object = {}): Promise<AuthData> => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${this.domain}/authorize?${toQueryString({
        state: prepareState({
          workspaceId: this.workspaceId,
          profileId: this.profileId,
        }),
        client_id: this.clientId,
        response_type: 'id_token',
        scope: 'openid email profile',
        redirect_uri: redirectUrl,
        nonce: 'fakenonce',
        ...options,
      })}`,
    });

    if (result.type === 'success') {
      const error = getError(result);
      if (error) {
        const errorDescription = getErrorDescription(result);

        throw new Error(
          errorDescription || 'something went wrong while logging in',
        );
      }

      const encodedIdToken = getIdToken(result);
      const decodedIdToken = jwtDecode(encodedIdToken);

      await this.setAuthState({
        token: encodedIdToken,
      });

      return {
        idToken: encodedIdToken,
        idTokenPayload: decodedIdToken,
        email: getEmail(decodedIdToken),
        isEmailVerified: isEmailVerified(decodedIdToken),
        state: getState(decodedIdToken),
      };
    }
  };

  renewToken = () => {
    throw new Error('The function isn\'t implemented yet');
  };

  changePassword = () => {
    throw new Error('The function isn\'t implemented yet');
  };
}

export { ReactNativeAuth0AuthClient };

