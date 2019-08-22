import {
  IAuthState,
  IAuthClient,
  IStorage,
  PACKAGES,
  StorageAPI,
  throwIfMissingRequiredParameters,
} from '@8base/utils';

interface IApiTokenAuthClientOptions {
  apiToken: string;
}

/**
 * Creates instacne of the api token auth client
 */
class ApiTokenAuthClient implements IAuthClient {
  private storageAPI: StorageAPI<IAuthState>;
  private apiToken: string;

  constructor(
    options: IApiTokenAuthClientOptions,
    storage: IStorage = window.localStorage,
    storageKey: string = 'auth',
  ) {
    throwIfMissingRequiredParameters(['apiToken'], PACKAGES.API_TOKEN_AUTH_CLIENT, options);

    const { apiToken } = options;

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
