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
    this.handling = false;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      let subscription = null;

      const handleTokenRefresh = () => {
        this.handleTokenExpired()
          .then(() => {
            const observable = forward(operation);

            if (subscription) {
              subscription.unsubscribe();
            }

            subscription = observable.subscribe(subscriber);

            this.handling = false;
          })
          .catch((err) => {
            this.handleAuthFailed(err);

            observer.complete();

            this.handling = false;
          });
      };

      const subscriber = {
        next: data => {
          const dataErrors = data.errors || [];

          if (hasIdTokenExpiredError(dataErrors)) {
            handleTokenRefresh();
          } else if (hasRefreshTokenExpiredError(dataErrors)) {
            this.handleAuthFailed();
          } else {
            observer.next(data);
          }
        },
        error: error => {
          const batchedErrors = R.pathOr([error], ['response', 'parsed', 'errors'], error);

          if (hasIdTokenExpiredError(batchedErrors)) {
            handleTokenRefresh();
          } else if (hasRefreshTokenExpiredError(batchedErrors)) {
            this.handleAuthFailed();
          } else {
            observer.error(error);
          }
        },
        complete: () => {
          if (!this.handling) {
            observer.complete();
          }
        },
      };

      subscription = forward(operation).subscribe(subscriber);

      return subscription;
    });
  }

  handleTokenExpired() {
    this.handling = true;

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
