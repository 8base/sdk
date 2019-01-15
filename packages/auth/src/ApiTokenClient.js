// @flow
import * as localStorageAccessor from './localStorageAccessor';

import type {
  AuthState,
  AuthClient,
  ApiTokenClientOptions,
} from './types';

class ApiTokenClient implements AuthClient {
  apiToken: string;

  constructor({ apiToken }: ApiTokenClientOptions) {
    this.apiToken = apiToken;

    localStorageAccessor.setAuthState({
      token: apiToken,
    });
  }

  getAuthState = (): AuthState => localStorageAccessor.getAuthState();

  setAuthState = (state: AuthState) => {
    localStorageAccessor.setAuthState({
      ...state,
      token: this.apiToken,
    });
  };

  purgeAuthState = (): void => {
    localStorageAccessor.purgeAuthState();

    localStorageAccessor.setAuthState({
      token: this.apiToken,
    });
  };

  checkIsAuthorized = (): boolean => true;
}

export { ApiTokenClient };

