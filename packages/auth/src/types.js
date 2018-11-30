// @flow
export type PossibleAuthItems = 'email' | 'userId' | 'workspaceId' | 'refreshToken' | 'idToken';

export type AuthState = {
  [PossibleAuthItems]: string,
}

export interface Auth0WebClientOptions {
  domain: string,
  clientID: string,
  redirectUri: string,
  workspaceId?: string,
  logoutRedirectUri?: string,
}

export interface AuthClient {
  authorize(options: Object): void,
  logout(options: Object): void,
  checkSession(options?: Object): Promise<{ idToken: string }>,
  getAuthorizedData(): Promise<{ isEmailVerified: boolean, idToken: string, email: string }>,
  getAuthState(): AuthState,
  setAuthState(state: AuthState): void,
  purgeAuthState(): void,
  changePassword(): Promise<{ email: string }>,
}

export type AuthContextProps = {
  isAuthorized: boolean,
} & AuthClient
