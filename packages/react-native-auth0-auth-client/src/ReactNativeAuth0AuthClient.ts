import jwtDecode from 'jwt-decode';
import R from 'ramda';
import { Subtract } from 'utility-types';
import { AuthState, AuthData, IAuthClient, IAuthorizable, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';
import * as asyncStorageAccessor from './asyncStorageAccessor';

const { AuthSession } = require('expo'); // tslint:disable-line

type ReactNativeAuth0AuthClientOptions = {
  clientId: string;
  domain: string;
};

const toQueryString = R.pipe(
  R.mapObjIndexed((value: any, key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`),
  R.values,
  R.join('&'),
);

const isEmptyOrNil = R.either(R.isNil, R.isEmpty);

const getError = R.path(['params', 'error']);

const getErrorDescription = R.path<string>(['params', 'error_description']);

const getIdToken = R.path<string>(['params', 'id_token']);

const getEmail = R.path<string>(['email']);

const isEmailVerified = R.pathOr<boolean>(false, ['email_verified']);

/**
 * Create instacne of the react-native auth0 auth client.
 * @param {string} domain Domain. See auth0 documentation.
 * @param {string} clientId Client id. See auth0 documentation.
 */
class ReactNativeAuth0AuthClient implements IAuthClient, Subtract<IAuthorizable, { logout: any }> {
  public clientId: string;
  public domain: string;

  constructor({ clientId, domain }: ReactNativeAuth0AuthClientOptions) {
    this.clientId = clientId;
    this.domain = domain;
  }

  public setAuthState = async (state: AuthState): Promise<void> => {
    await asyncStorageAccessor.setAuthState(state);
  };

  public getAuthState = async (): Promise<AuthState> => asyncStorageAccessor.getAuthState();

  public purgeAuthState = async (): Promise<void> => {
    await asyncStorageAccessor.purgeAuthState();
    AuthSession.dismiss();
  };

  public checkIsAuthorized = async (): Promise<boolean> => {
    const { token } = await asyncStorageAccessor.getAuthState();

    return R.not(isEmptyOrNil(token));
  };

  // @ts-ignore
  public authorize = async (options: object = {}): Promise<AuthData> => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${this.domain}/authorize?${toQueryString({
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

        throw new SDKError(
          ERROR_CODES.AUTH_FAILED,
          PACKAGES.REACT_NATIVE_AUTH0_AUTH_CLIENT,
          errorDescription || 'something went wrong while logging in',
        );
      }

      const encodedIdToken = getIdToken(result);
      const decodedIdToken: string = jwtDecode(encodedIdToken || '');

      await this.setAuthState({
        token: encodedIdToken,
      });

      return {
        email: getEmail(decodedIdToken) || '',
        idToken: encodedIdToken || '',
        idTokenPayload: decodedIdToken,
        isEmailVerified: isEmailVerified(decodedIdToken),
      };
    } else {
      throw new SDKError(ERROR_CODES.AUTH_FAILED, PACKAGES.REACT_NATIVE_AUTH0_AUTH_CLIENT, 'Auth was failed');
    }
  };

  public renewToken = () => {
    throw new SDKError(
      ERROR_CODES.NOT_IMPLEMENTED,
      PACKAGES.REACT_NATIVE_AUTH0_AUTH_CLIENT,
      `The function isn't implemented yet`,
    );
  };

  public changePassword = () => {
    throw new SDKError(
      ERROR_CODES.NOT_IMPLEMENTED,
      PACKAGES.REACT_NATIVE_AUTH0_AUTH_CLIENT,
      `The function isn't implemented yet`,
    );
  };
}

export { ReactNativeAuth0AuthClient };
