// @flow

import * as R from 'ramda';
import { ApolloLink } from 'apollo-link';
import type { GetAuthStateParams } from '../types';

const assocWhenNotEmpty = (key: string, value?: ?string) => R.cond([
  [() => !R.isEmpty(value), R.assoc(key, value)],
  [R.T, R.identity],
]);

const getAuthLink = ({ getAuthState }: GetAuthStateParams) => {
  if (getAuthState === undefined) {
    throw new Error('Excepted a getAuthState callback');
  } else {
    return new ApolloLink((operation, forward) => {
      const { idToken, organizationId, accountId } = getAuthState();

      operation.setContext(
        R.over(R.lensProp('headers'), R.pipe(
          assocWhenNotEmpty('authorization', idToken),
          assocWhenNotEmpty('organization-id', organizationId),
          assocWhenNotEmpty('account-id', accountId),
        )));

      return forward(operation);
    });
  }
};

export { getAuthLink };
