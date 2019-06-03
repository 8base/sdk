export type ErrorObject = {
  code: string,
  message: string,
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
  onAuthError?: (error?: {}) => void;
  onIdTokenExpired?: () => Promise<any>;
};

export type ErrorLinkParameters = {
  onGraphQLErrors?: (error: GraphQLError[]) => void,
  onNetworkError?: (error: {}) => void,
};

export type AuthState = {
  workspaceId?: string,
  token?: string,
};

export type AuthHeadersLinkParameters = {
  getAuthState: () => AuthState,
};

export type AuthLinkParameters = TokenRefreshLinkParameters & AuthHeadersLinkParameters;