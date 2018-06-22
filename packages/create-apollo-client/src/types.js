export type AuthState = {
  email: string,
  organizationId: string,
  accountId: string,
  idToken: string,
  refreshToken: string,
}

export type GraphQLError = {
  code: string,
  details: Object,
  message: string,
}

export type GetErrorLinkParams = {
  onGraphQLErrors?: (GraphQLError[]) => void,
  onNetworkError?: (error: Object) => void,
}

export type GetAuthStateParams = {
  getAuthState?: () => AuthState,
}

export type GetTokenRefreshLinkParams = {
  onIdTokenExpired?: () => void,
  onUpdateTokenFail?: ({ refreshToken: string, idToken: string }) => void,
  onUpdateTokenSuccess?: (error?:Object) => void,
}
