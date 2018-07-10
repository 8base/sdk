// @flow

import { TokenRefreshLink } from '@8base/apollo-links';
import type { GetTokenRefreshLinkParams, GetAuthStateParams } from '../types';

const getTokenRefreshLink =
({ onUpdateTokenFail, onUpdateTokenSuccess, getAuthState, onIdTokenExpired }: GetTokenRefreshLinkParams & GetAuthStateParams) => {
  if (getAuthState === undefined) {
    throw new Error('Excepted a getAuthState callback');
  } else {
    return new TokenRefreshLink({
      getRefreshTokenParameters: () => {
        const { refreshToken, email } = getAuthState();

        return { email, refreshToken };
      },
      onIdTokenExpired: () => {
        onIdTokenExpired && onIdTokenExpired();
      },
      onAuthSuccess: ({ refreshToken, idToken }) => {
        onUpdateTokenSuccess && onUpdateTokenSuccess({ refreshToken, idToken });
      },
      onAuthError: (error) => {
        onUpdateTokenFail && onUpdateTokenFail(error);
      },
    });
  }
};


export { getTokenRefreshLink };
