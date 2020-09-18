import * as R from 'ramda';
import {
  throwIfMissingRequiredParameters,
  StorageAPI,
  PACKAGES,
  IAuthState,
  IAuthClient,
  IStorageOptions,
} from '@8base/utils';
import qs from 'qs';
import jwtDecode from 'jwt-decode';

export interface ICognitoIdTokenData {
  name: string;
  family_name: string;
  email: string;
}

export interface ICognitoParseResult {
  state?: object;
  id_token: string;
  access_token: string;
}

export interface ICognitoData {
  state?: object;
  idToken: string;
  accessToken: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IWebCognitoAuthClientOptions {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri?: string;
}

const isEmptyOrNil = R.either(R.isNil, R.isEmpty);

/**
 * Creates instance of the web Cognito auth client.
 */
class WebCognitoAuthClient implements IAuthClient {
  private logoutHasCalled: boolean;
  private readonly logoutRedirectUri?: string;
  private readonly clientId: string;
  private readonly redirectUri: string;
  private readonly domain: string;
  private storageAPI: StorageAPI<IAuthState>;

  constructor(options: IWebCognitoAuthClientOptions, storageOptions: IStorageOptions<IAuthState> = {}) {
    throwIfMissingRequiredParameters(['domain', 'clientId', 'redirectUri'], PACKAGES.WEB_COGNITO_AUTH_CLIENT, options);

    const { logoutRedirectUri, clientId, redirectUri, domain } = options;

    this.storageAPI = new StorageAPI<IAuthState>(
      storageOptions.storage || window.localStorage,
      storageOptions.storageKey || 'auth',
      storageOptions.initialState,
    );

    this.logoutHasCalled = false;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.logoutRedirectUri = logoutRedirectUri;
    this.domain = domain;
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
    const link = `${this.domain}/oauth2/authorize?${qs.stringify(
      {
        client_id: this.clientId,
        response_type: 'token',
        redirect_uri: this.redirectUri,
      },
      {
        encode: false,
      },
    )}`;

    window.location.replace(link);
  }

  public checkSession(options: object = {}) {
    return null;
  }

  public getAuthorizedData(): ICognitoData {
    const querySearch = window.location.href.split('#')[1];

    const result: ICognitoParseResult = qs.parse(querySearch) as any;

    const jwtResult: ICognitoIdTokenData = jwtDecode(result.id_token);

    return {
      idToken: result.id_token,
      accessToken: result.access_token,
      state: result.state,
      firstName: jwtResult.name,
      lastName: jwtResult.family_name,
      email: jwtResult.email,
    };
  }

  public logout(options: object = {}): void {
    window.addEventListener('unload', () => {
      this.purgeState();
    });

    window.location.replace(
      `${this.domain}/logout?${qs.stringify(
        {
          client_id: this.clientId,
          response_type: 'token',
          redirect_uri: this.redirectUri,
        },
        {
          encode: false,
        },
      )}`,
    );
  }
}

export { WebCognitoAuthClient };
