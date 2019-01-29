// @flow
import { localStorageAccessor } from '@8base/web-utils';
import type { AuthState, AuthClient } from '@8base/utils';

type WebApiTokenAuthClientOptions = {
  apiToken: string,
};

/**
 * Create instacne of the api token auth client
 * @param {string} apiToken Api Token generated in 8base app.
 */
class WebApiTokenAuthClient implements AuthClient {
  apiToken: string;

  constructor({ apiToken }: WebApiTokenAuthClientOptions) {
    this.apiToken = apiToken;

    localStorageAccessor.setAuthState({
      token: apiToken,
    });
  }

  getAuthState = async (): Promise<AuthState> => localStorageAccessor.getAuthState();

  setAuthState = async (state: AuthState): Promise<void> => {
    localStorageAccessor.setAuthState({
      ...state,
      token: this.apiToken,
    });
  };

  purgeAuthState = async (): Promise<void> => {
    localStorageAccessor.purgeAuthState();

    localStorageAccessor.setAuthState({
      token: this.apiToken,
    });
  };

  checkIsAuthorized = async (): Promise<boolean> => true;
}

export { WebApiTokenAuthClient };

