// @flow
export type ErrorObject = {
  code: string,
  message: string,
};

export type RefreshTokenQueryResult = {
  refreshToken: string,
  idToken: string,
};

export type RefreshTokenQueryInput = {
  refreshToken: string,
  email: string,
};

type GraphQLError = {
  code: string,
  details: {},
  message: string,
};

export type TokenRefreshLinkParameters = {
  getRefreshTokenParameters: () => RefreshTokenQueryInput;
  onAuthSuccess: (RefreshTokenQueryResult) => void;
  onAuthError?: (error?: {}) => void;
  onIdTokenExpired?: () => void;
};

export type ErrorLinkParameters = {
  onGraphQLErrors?: (GraphQLError[]) => void,
  onNetworkError?: (error: {}) => void,
};

export type AuthState = {
  organizationId?: string,
  accountId?: string,
  idToken?: string,
};

export type AuthHeadersLinkParameters = {
  getAuthState: () => AuthState,
};

export type AuthLinkParameters = TokenRefreshLinkParameters & AuthHeadersLinkParameters;
