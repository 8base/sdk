import {
  IAuthState,
  IAuthClient,
  IStorage,
  PACKAGES,
  StorageAPI,
  throwIfMissingRequiredParameters,
} from '@8base/utils';

interface IWebOAuthClientOptions {
  authorize: (this: WebOAuthClient, ...rest: any) => any | Promise<any>;
  logout?: (this: WebOAuthClient, ...rest: any) => any | Promise<any>;
}

/**
 * Creates instance of the web oauth client
 */
class WebOAuthClient implements IAuthClient {
  private options: IWebOAuthClientOptions;
  private storageAPI: StorageAPI<IAuthState>;

  constructor(options: IWebOAuthClientOptions, storage: IStorage = window.localStorage, storageKey: string = 'auth') {
    throwIfMissingRequiredParameters(['authorize'], PACKAGES.WEB_AUTH0_AUTH_CLIENT, options);

    this.storageAPI = new StorageAPI<IAuthState>(storage, storageKey);
    this.options = options;
  }

  public setState(state: IAuthState) {
    this.storageAPI.setState(state);
  }

  public getState(): IAuthState {
    return this.storageAPI.getState();
  }

  public purgeState() {
    this.storageAPI.purgeState();
  }

  public checkIsAuthorized() {
    const { token } = this.getState();

    return token !== '' && token !== null && token !== undefined;
  }

  public authorize(...args: any) {
    return this.options.authorize.apply(this, args);
  }

  public logout(...args: any) {
    if (typeof this.options.logout === 'function') {
      return this.options.logout.apply(this, args);
    }
  }
}

export { WebOAuthClient };
