// @flow

import { ApolloLink, Operation } from 'apollo-link';

import { createAuthHeadersLink } from './authHeadersLink';
import { authHeadersCleanerLink } from './authHeadersCleanerLink';
import { TokenRefreshLink } from './TokenRefreshLink';

import type { AuthLinkParameters } from './types';

export const createAuthLink = (authLinkParameters: AuthLinkParameters): ApolloLink => {
  const authHeadersLink: ApolloLink = createAuthHeadersLink(authLinkParameters);
  const tokenRefreshLink: TokenRefreshLink = new TokenRefreshLink(authLinkParameters);
  const authLink: ApolloLink = tokenRefreshLink.split(
    (operation: Operation): boolean => operation.getContext().isRefreshingToken,
    authHeadersCleanerLink,
    authHeadersLink,
  );

  return authLink;
};
