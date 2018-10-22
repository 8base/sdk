// @flow

import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';

import { AuthHeadersLink } from './AuthHeadersLink';
import { TokenRefreshLink } from './TokenRefreshLink';

import type { AuthLinkParameters } from './types';

export class AuthLink extends ApolloLink {
  constructor(authLinkParameters: AuthLinkParameters) {
    super();

    const authHeadersLink = new AuthHeadersLink(authLinkParameters);
    const tokenRefreshLink = new TokenRefreshLink(authLinkParameters);

    this.link = ApolloLink.from([
      tokenRefreshLink,
      authHeadersLink,
    ]);
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return this.link.request(operation, forward);
  }
}
