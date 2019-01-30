// @flow
import type { AuthState, AuthClient } from '@8base/utils';

type ApiTokenAuthClientOptions = {
  apiToken: string,
};

/**
 * Create instacne of the api token auth client
 * @param {string} apiToken Api Token generated in 8base app.
 */
class ApiTokenAuthClient implements AuthClient {
  apiToken: string;
  state: {};

  constructor({ apiToken }: ApiTokenAuthClientOptions) {
    if (!apiToken) {
      throw new Error('apiToken is required');
    }

    this.apiToken = apiToken;
    this.state = {};
  }

  getAuthState = async (): Promise<AuthState> => ({
    token: this.apiToken,
    ...this.state,
  });

  setAuthState = async (state: AuthState): Promise<void> => {
    this.state = {
      ...this.state,
      ...state,
      token: this.apiToken,
    };
  };

  purgeAuthState = async (): Promise<void> => {
    this.state = {};
  };

  checkIsAuthorized = async (): Promise<boolean> => true;
}

export { ApiTokenAuthClient };

