import { IAuthState, IAuthClient, IStorage, SDKError, ERROR_CODES, PACKAGES, StorageAPI } from '@8base/utils';

/**
 * Creates instacne of the api token auth client
 */
class ApiTokenAuthClient implements IAuthClient {
  private storageAPI: StorageAPI<IAuthState>;
  private apiToken: string;

  constructor(apiToken: string, storage: IStorage = window.localStorage, storageKey: string = 'auth') {
    if (!apiToken) {
      throw new SDKError(ERROR_CODES.MISSING_PARAMETER, PACKAGES.API_TOKEN_AUTH_CLIENT, 'apiToken is required');
    }

    this.storageAPI = new StorageAPI<IAuthState>(storage, storageKey);
    this.apiToken = apiToken;

    this.storageAPI.setState({ token: apiToken });
  }

  public getState(): IAuthState {
    return {
      ...this.storageAPI.getState(),
      token: this.apiToken,
    };
  }

  public setState(state: IAuthState): void {
    this.storageAPI.setState({
      ...state,
      token: this.apiToken,
    });
  }

  public purgeState(): void {
    this.storageAPI.purgeState();
    this.storageAPI.setState({ token: this.apiToken });
  }

  public checkIsAuthorized(): boolean {
    return true;
  }
}

export { ApiTokenAuthClient };
