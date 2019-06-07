import { ApolloLink, Observable, createOperation, Operation, NextLink, FetchResult } from 'apollo-link';
import R from 'ramda';
import { ZenObservable } from 'zen-observable-ts';

import { hasUserNotExistError } from './utils';
import { SignUpLinkParameters, AuthState } from './types';
import { SIGNUP_MUTATION } from './graphql/mutations';

/**
 * SignUp Link sends userSignUp mutation on server if user isn't registered
 * @param {SignUpLinkParameters} options - The link\'s options.
 * @param {Function} options.getAuthState - Function which called to get user\'s email and auth token.
 * @param {String} options.authProfileId - Auth Profile Id copied from 8base authentication page.
 */
export class SignUpLink extends ApolloLink {
  public getAuthState: () => Promise<AuthState>;
  public authProfileId: string;
  public signUpPromise: Promise<undefined> | null;
  public fetching: boolean;

  constructor({ getAuthState, authProfileId }: SignUpLinkParameters) {
    super();

    this.getAuthState = getAuthState;
    this.authProfileId = authProfileId;
    this.signUpPromise = null;
    this.fetching = false;
  }

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      let subscription: ZenObservable.Subscription | null = null;

      const handleUserNotExistError = () => {
        this.sendSignUp(operation, forward)
          .then(() => {
            if (subscription) {
              subscription.unsubscribe();
            }

            subscription = forward(operation).subscribe(subscriber);
          })
          .catch(error => {
            observer.error(error);
          });
      };

      const subscriber = {
        complete: () => {
          if (!this.fetching) {
            observer.complete();
          }
        },
        error: (error: any) => {
          const batchedErrors = R.pathOr([error], ['response', 'parsed', 'errors'], error);

          if (hasUserNotExistError(batchedErrors)) {
            handleUserNotExistError();
          } else {
            observer.error(error);
          }
        },
        next: (data: any) => {
          const errors = data.errors || [];

          if (hasUserNotExistError(errors)) {
            this.fetching = true;

            handleUserNotExistError();
          } else {
            observer.next(data);
          }
        },
      };

      subscription = forward(operation).subscribe(subscriber);
    });
  }

  public async sendSignUp(operation: Operation, forward: NextLink) {
    const { email } = await this.getAuthState();

    if (this.signUpPromise === null) {
      this.signUpPromise = new Promise((resolve, reject) => {
        const signUpOperation = createOperation(operation.getContext(), {
          query: SIGNUP_MUTATION,
          variables: {
            authProfileId: this.authProfileId,
            user: {
              email,
            },
          },
        });

        forward(signUpOperation).subscribe({
          complete: () => {
            this.signUpPromise = null;
            this.fetching = false;
          },
          error: reject,
          next: data => {
            if (R.path(['data', 'userSignUp', 'id'], data)) {
              resolve();
            } else {
              reject(data);
            }
          },
        });
      });
    }

    return this.signUpPromise;
  }
}
