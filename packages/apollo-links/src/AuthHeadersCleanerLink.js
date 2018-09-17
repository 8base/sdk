// @flow

import * as R from 'ramda';
import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';

const removeAuthorizationHeader: ({}) => {} = R.over(
  R.lensProp('headers'),
  R.dissoc('authorization'),
);

export class AuthHeadersCleanerLink extends ApolloLink {
  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    operation.setContext(removeAuthorizationHeader);

    return forward(operation);
  }
}
