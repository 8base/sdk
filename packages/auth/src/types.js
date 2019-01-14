// @flow
export type PossibleAuthItems = 'email' | 'userId' | 'workspaceId' | 'refreshToken' | 'token';

export type AuthState = {
  [PossibleAuthItems]: string,
};

export type Auth0WebClientOptions = {
  domain: string,
  clientID: string,
  redirectUri: string,
  workspaceId?: string,
  logoutRedirectUri?: string,
};

export type ApiTokenClientOptions = {
  apiToken: string,
};

export interface AuthClient {
  getAuthState(): AuthState,
  setAuthState(state: AuthState): void,
  purgeAuthState(): void,
  checkIsAuthorized(): boolean,
}

export interface Authorizable {
  authorize(options: Object): void,
  logout(options: Object): void,
  checkSession(options?: Object): Promise<{ idToken: string }>,
  getAuthorizedData(): Promise<{
    isEmailVerified: boolean,
    email: string,
    idToken: string,
  }>,
  changePassword(): Promise<{ email: string }>,
}

export type AuthContextProps = {
  isAuthorized: boolean,
} & AuthClient;

