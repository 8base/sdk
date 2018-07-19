// @flow

import * as R from 'ramda';
import { onError } from 'apollo-link-error';
import type { ErrorLinkParameters } from './types';

export const createErrorLink = ({ onGraphQLErrors, onNetworkError }: ErrorLinkParameters) =>
  onError((error) => {
    const { graphQLErrors, networkError } = error;

    if (!R.isNil(graphQLErrors)) {
      onGraphQLErrors && onGraphQLErrors(graphQLErrors);
    }
    if (!R.isNil(networkError)) {
      onNetworkError && onNetworkError(networkError);
    }
  });
