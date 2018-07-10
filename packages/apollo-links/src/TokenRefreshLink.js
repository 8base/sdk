//@flow
import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
  createOperation,
} from 'apollo-link';
import gql from 'graphql-tag';
import * as R from 'ramda';

import type { TokenRefreshLinkOptions, RefreshTokenResult, RefreshTokenParameters } from './types';
import { RefreshTokenInvalidError } from './RefreshTokenInvalidError';
import { hasTokenExpiredError, hasTokenInvalidError } from './utils';

const USER_REFRESH_TOKEN_QUERY = `
  mutation UserRefreshToken($refreshToken: String!, $email: String!) {
    userRefreshToken(data: {
      refreshToken: $refreshToken,
      email: $email,
    }) {
      refreshToken
      idToken
    }
  }
`;

const removeAuthorizationHeader = R.over(
  R.lensProp('headers'),
  R.dissoc('authorization'),
);

/**
 * Token Refresh Link renew authentication token when it's expired.
 * @param {TokenRefreshLinkOptions} options - The token refresh link options.
 * @param {Function} options.getRefreshTokenParameters - The function which are using for get refresh token parameters.
 * @param {Function} options.onAuthSuccess - The callback which called when attempt to refresh authentication is success.
 * @param {Function} [options.onAuthError] - The callback which called when attempt to refresh authentication is failed.
 * @param {Function} [options.onIdTokenExpired] - The callback which called when id token is expired.
 */
class TokenRefreshLink extends ApolloLink {
  constructor({
    getRefreshTokenParameters,
    onAuthSuccess,
    onAuthError,
    onIdTokenExpired,
  } : TokenRefreshLinkOptions) {
    super();

    this.getRefreshTokenParameters = getRefreshTokenParameters;
    this.onAuthSuccess = onAuthSuccess;
    this.onAuthError = onAuthError;
    this.onIdTokenExpired = onIdTokenExpired;
    this.fetching = false;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      let subscription = null;

      const handleTokenRefresh = () => {
        this.refreshToken(operation, forward).then(() => {
          const observable = forward(operation);

          if (subscription) {
            subscription.unsubscribe();
          }

          subscription = observable.subscribe(subscriber);
        }).catch((err) => {
          if (err instanceof RefreshTokenInvalidError) {
            this.handleAuthFailed(err);
          } else {
            observer.error(err);
          }
        });
      };

      const subscriber = {
        next: data => {
          const dataErrors = data.errors || [];

          if (hasTokenExpiredError(dataErrors)) {
            this.handleTokenExpired();

            handleTokenRefresh();
          } else if (hasTokenInvalidError(dataErrors)) {
            this.handleAuthFailed();
          } else {
            observer.next(data);
          }
        },
        error: error => {
          const batchedErrors = R.pathOr([error], ['response', 'parsed', 'errors'], error);

          if (hasTokenExpiredError(batchedErrors)) {
            this.handleTokenExpired();

            handleTokenRefresh();
          } else if (hasTokenInvalidError(batchedErrors)) {
            this.handleAuthFailed();
          } else {
            observer.error(error);
          }
        },
        complete: () => {
          if (!this.fetching) {
            observer.complete();
          }
        },
      };

      subscription = forward(operation).subscribe(subscriber);

      return subscription;
    });
  }

  handleTokenExpired() {
    if (typeof this.onIdTokenExpired === 'function') {
      this.onIdTokenExpired();
    }
  }

  handleAuthFailed(err?: Object) {
    if (typeof this.onAuthError === 'function') {
      this.onAuthError(err);
    }
  }

  refreshToken (operation: Operation, forward: NextLink): Promise<void> {
    this.fetching = true;

    const context = removeAuthorizationHeader(operation.getContext());
    const mutate = (req: *) => forward(createOperation(context, req));

    return new Promise((resolve, reject) => {
      const refreshTokenParameters: RefreshTokenParameters = this.getRefreshTokenParameters();

      mutate({
        query: gql(USER_REFRESH_TOKEN_QUERY),
        variables: refreshTokenParameters,
      }).subscribe({
        error: reject,
        next: ({ data }) => {
          if (data === null || data.userRefreshToken === null) {
            reject(new RefreshTokenInvalidError());
          } else {
            const { refreshToken, idToken }: RefreshTokenResult = data.userRefreshToken;

            this.onAuthSuccess({ refreshToken, idToken });

            resolve();
          }
        },
        complete: () => {
          this.fetching = false;
        },
      });
    });
  }
}


export { TokenRefreshLink };
