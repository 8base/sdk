//@flow
type ErrorObject = {
  code: string,
  message: string,
};

type RefreshTokenResult = {
  refreshToken: string,
  idToken: string,
};

type RefreshTokenParameters = {
  refreshToken: string,
  email: string,
};

type TokenRefreshLinkOptions = {
  getRefreshTokenParameters: () => RefreshTokenParameters;
  onAuthSuccess: (auth: RefreshTokenResult) => void;
  onAuthError?: (error?: Object) => void;
  onIdTokenExpired?: () => void;
};

export type { TokenRefreshLinkOptions, ErrorObject, RefreshTokenResult, RefreshTokenParameters };
