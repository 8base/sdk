// @flow

import * as R from 'ramda';
import {
  ApolloLink,
  RequestHandler,
} from 'apollo-link';

const removeAuthorizationHeader: ({}) => {} = R.over(
  R.lensProp('headers'),
  R.dissoc('authorization'),
);

const requestHandler: RequestHandler = (operation, forward) => {
  operation.setContext(removeAuthorizationHeader);

  return forward(operation);
};

export const authHeadersCleanerLink: ApolloLink = new ApolloLink(requestHandler);
