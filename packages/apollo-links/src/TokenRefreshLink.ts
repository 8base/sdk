import * as R from 'ramda';
import { ApolloLink, Observable, Operation, NextLink, FetchResult } from '@apollo/client';

import { hasIdTokenExpiredError, hasRefreshTokenExpiredError, hasTokenInvalidError } from './utils';

import { TokenRefreshLinkParameters } from './types';

/**
 * Token Refresh Link renew authentication token when it's expired.
 * @param {TokenRefreshLinkOptions} options - The token refresh link options.
 * @param {Function} options.onAuthSuccess - The callback which called when attempt to refresh authentication is success.
 * @param {Function} [options.onAuthError] - The callback which called when attempt to refresh authentication is failed.
 * @param {Function} [options.onIdTokenExpired] - The callback which called when id token is expired.
 */
export class TokenRefreshLink extends ApolloLink {
  public onAuthError?: (error?: {}) => void;
  public onIdTokenExpired?: () => Promise<any>;

  constructor({ onIdTokenExpired, onAuthError }: TokenRefreshLinkParameters) {
    super();

    this.onAuthError = onAuthError;
    this.onIdTokenExpired = onIdTokenExpired;
  }

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      let subscription: any = null;
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
          .catch(err => {
            this.handleAuthFailed(err);

            handling = false;

            observer.complete();
          });
      };

      const subscriber = {
        complete: () => {
          if (!handling) {
            observer.complete();
          }
        },
        error: (error: any) => {
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
        next: (data: any) => {
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
      };

      subscription = forward(operation).subscribe(subscriber);

      return subscription;
    });
  }

  public handleTokenExpired() {
    if (typeof this.onIdTokenExpired === 'function') {
      return this.onIdTokenExpired();
    }

    return Promise.reject();
  }

  public handleAuthFailed(err?: object) {
    if (typeof this.onAuthError === 'function') {
      this.onAuthError(err);
    }
  }
}
