import { AuthState, IAuthClient } from '@8base/utils';

type ApiTokenAuthClientOptions = {
  apiToken: string;
};

/**
 * Create instacne of the api token auth client
 * @param {string} apiToken Api Token generated in 8base app.
 */
class ApiTokenAuthClient implements IAuthClient {
  public apiToken: string;
  public state: {};

  constructor({ apiToken }: ApiTokenAuthClientOptions) {
    if (!apiToken) {
      throw new Error('apiToken is required');
    }

    this.apiToken = apiToken;
    this.state = {};
  }

  public getAuthState = async (): Promise<AuthState> => ({
    token: this.apiToken,
    ...this.state,
  });

  public setAuthState = async (state: AuthState): Promise<void> => {
    this.state = {
      ...this.state,
      ...state,
      token: this.apiToken,
    };
  };

  public purgeAuthState = async (): Promise<void> => {
    this.state = {};
  };

  public checkIsAuthorized = async (): Promise<boolean> => true;
}

export { ApiTokenAuthClient };
