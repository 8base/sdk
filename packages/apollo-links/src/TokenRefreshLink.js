// @flow
import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from 'apollo-link';
import * as R from 'ramda';

import {
  hasIdTokenExpiredError,
  hasRefreshTokenExpiredError,
  hasTokenInvalidError,
} from './utils';

import type { TokenRefreshLinkParameters } from './types';

/**
 * Token Refresh Link renew authentication token when it's expired.
 * @param {TokenRefreshLinkOptions} options - The token refresh link options.
 * @param {Function} options.getRefreshTokenParameters - The function which are using for get refresh token parameters.
 * @param {Function} options.onAuthSuccess - The callback which called when attempt to refresh authentication is success.
 * @param {Function} [options.onAuthError] - The callback which called when attempt to refresh authentication is failed.
 * @param {Function} [options.onIdTokenExpired] - The callback which called when id token is expired.
 */
export class TokenRefreshLink extends ApolloLink {
  constructor({
    onIdTokenExpired,
    onAuthError,
  } : TokenRefreshLinkParameters) {
    super();

    this.onAuthError = onAuthError;
    this.onIdTokenExpired = onIdTokenExpired;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      let subscription = null;
      let handling = false;

      const handleTokenRefresh = () => {
        this.handleTokenExpired()
          .then(() => {
            const observable = forward(operation);

            if (subscription) {
              subscription.unsubscribe();
            }

            handling = false;

            subscription = observable.subscribe(subscriber);
          })
          .catch((err) => {
            this.handleAuthFailed(err);

            handling = false;

            observer.complete();
          });
      };

      const subscriber = {
        next: data => {
          const dataErrors = data.errors || [];

          if (hasIdTokenExpiredError(dataErrors)) {
            handling = true;
            handleTokenRefresh();
          } else if (hasRefreshTokenExpiredError(dataErrors) || hasTokenInvalidError(dataErrors)) {
            this.handleAuthFailed();
          } else {
            observer.next(data);
          }
        },
        error: error => {
          const batchedErrors = R.pathOr([error], ['response', 'parsed', 'errors'], error);

          if (hasIdTokenExpiredError(batchedErrors)) {
            handling = true;
            handleTokenRefresh();
          } else if (hasRefreshTokenExpiredError(batchedErrors) || hasTokenInvalidError(batchedErrors)) {
            this.handleAuthFailed();
          } else {
            observer.error(error);
          }
        },
        complete: () => {
          if (!handling) {
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
      return this.onIdTokenExpired();
    }

    return Promise.reject();
  }

  handleAuthFailed(err?: Object) {
    if (typeof this.onAuthError === 'function') {
      this.onAuthError(err);
    }
  }
}

