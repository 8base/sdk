import { ApolloLink, Operation, NextLink, Observable, FetchResult } from '@apollo/client';

import { AuthHeadersLink } from './AuthHeadersLink';
import { TokenRefreshLink } from './TokenRefreshLink';

import { AuthLinkParameters } from './types';

export class AuthLink extends ApolloLink {
  public link: ApolloLink;

  constructor(authLinkParameters: AuthLinkParameters) {
    super();

    const authHeadersLink = new AuthHeadersLink(authLinkParameters);
    const tokenRefreshLink = new TokenRefreshLink(authLinkParameters);

    this.link = ApolloLink.from([tokenRefreshLink, authHeadersLink]);
  }

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
    return this.link.request(operation, forward);
  }
}
