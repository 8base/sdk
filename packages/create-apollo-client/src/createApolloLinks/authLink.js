// @flow

import * as R from 'ramda';
import { ApolloLink } from 'apollo-link';
import type { GetAuthStateParams } from '../types';


const getAuthLink = ({ getAuthState }: GetAuthStateParams) => {
  if (getAuthState === undefined) {
    throw new Error('Excepted a getAuthState callback');
  } else {
    return new ApolloLink((operation, forward) => {
      const { idToken, organizationId, accountId } = getAuthState();

      operation.setContext(
        R.over(R.lensProp('headers'), R.pipe(
          R.assoc('authorization', idToken),
          R.assoc('organization-id', organizationId),
          R.assoc('account-id', accountId),
        )));

      return forward(operation);
    });
  }
};

export { getAuthLink };
