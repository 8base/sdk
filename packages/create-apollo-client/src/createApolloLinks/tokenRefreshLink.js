// @flow

import { TokenRefreshLink } from '@8base/sdk';
import type { GetTokenRefreshLinkParams, GetAuthStateParams } from '../types';

const getTokenRefreshLink =
({ onUpdateTokenFail, onUpdateTokenSuccess, getAuthState, onIdTokenExpired }: GetTokenRefreshLinkParams & GetAuthStateParams) => {
  if (getAuthState === undefined) {
    throw new Error('Excepted a getAuthState callback');
  } else {
    return new TokenRefreshLink({
      setRefreshTokenInput: () => {
        const { refreshToken, email } = getAuthState();
        onIdTokenExpired && onIdTokenExpired();

        return { email, refreshToken };
      },
      authReceived: ({ refreshToken, idToken }) => {
        onUpdateTokenSuccess && onUpdateTokenSuccess({ refreshToken, idToken });
      },
      authFailed: (error) => {
        onUpdateTokenFail && onUpdateTokenFail(error);
      },
    });
  }
};


export { getTokenRefreshLink };
