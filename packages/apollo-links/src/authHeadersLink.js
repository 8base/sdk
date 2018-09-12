// @flow

import * as R from 'ramda';
import {
  ApolloLink,
  RequestHandler,
} from 'apollo-link';

import type { AuthHeadersLinkParameters, AuthState } from './types';

const assocWhenNotEmpty = (key: string, value: ?string) => R.when(
  R.always(
    R.complement(R.either(R.isNil, R.isEmpty))(value),
  ),
  R.assoc(key, value),
);

export const createAuthHeadersLink = ({ getAuthState }: AuthHeadersLinkParameters): ApolloLink => {
  if (typeof getAuthState !== 'function') {
    throw new Error('Excepted a getAuthState callback');
  } else {
    const requestHandler: RequestHandler = (operation, forward) => {
      const { idToken, organizationId, accountId }: AuthState = getAuthState();

      operation.setContext(
        R.over(R.lensProp('headers'), R.pipe(
          assocWhenNotEmpty('authorization', idToken ? `Bearer ${idToken}` : null),
          assocWhenNotEmpty('organization-id', organizationId),
          assocWhenNotEmpty('account-id', accountId),
        )),
      );

      return forward(operation);
    };
    const authHeadersLink: ApolloLink = new ApolloLink(requestHandler);

    return authHeadersLink;
  }
};
