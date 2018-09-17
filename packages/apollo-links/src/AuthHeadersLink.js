// @flow

import * as R from 'ramda';
import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';

import type { AuthHeadersLinkParameters, AuthState } from './types';

const assocWhenNotEmpty = (key: string, value: ?string) => R.when(
  R.always(
    R.complement(R.either(R.isNil, R.isEmpty))(value),
  ),
  R.assoc(key, value),
);

export class AuthHeadersLink extends ApolloLink {
  constructor({ getAuthState }: AuthHeadersLinkParameters) {
    super();

    this.getAuthState = getAuthState;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    const { idToken, organizationId, accountId }: AuthState = this.getAuthState();

    operation.setContext(
      R.over(R.lensProp('headers'), R.pipe(
        assocWhenNotEmpty('authorization', idToken ? `Bearer ${idToken}` : null),
        assocWhenNotEmpty('organization-id', organizationId),
        assocWhenNotEmpty('account-id', accountId),
      )),
    );

    return forward(operation);
  }
}
