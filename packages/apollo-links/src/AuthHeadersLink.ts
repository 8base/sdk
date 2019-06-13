import * as R from 'ramda';
import { ApolloLink, Operation, NextLink, Observable, FetchResult } from 'apollo-link';

import { AuthHeadersLinkParameters, AuthState } from './types';

const assocWhenNotEmpty = (key: string, value?: string | null) =>
  R.when(R.always(R.complement(R.either(R.isNil, R.isEmpty))(value)), R.assoc(key, value));

export class AuthHeadersLink extends ApolloLink {
  public getAuthState: () => Promise<AuthState>;

  constructor({ getAuthState }: AuthHeadersLinkParameters) {
    super();

    this.getAuthState = getAuthState;
  }

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      this.getAuthState().then(({ token, workspaceId }) => {
        operation.setContext(
          R.over(
            R.lensProp('headers'),
            R.pipe(
              assocWhenNotEmpty('authorization', token ? `Bearer ${token}` : null),
              assocWhenNotEmpty('workspace', workspaceId),
            ),
          ),
        );

        forward(operation).subscribe({
          complete: (...args) => observer.complete(...args),
          error: (...args) => observer.error(...args),
          next: (...args) => observer.next(...args),
        });
      });
    });
  }
}
