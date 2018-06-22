// @flow

import * as R from 'ramda';
import { onError } from 'apollo-link-error';
import type { GetErrorLinkParams } from '../types';

const getErrorLink = ({ onGraphQLErrors, onNetworkError }: GetErrorLinkParams) =>
  onError((error) => {
    const { graphQLErrors, networkError } = error;

    if (!R.isNil(graphQLErrors)) {
      onGraphQLErrors && onGraphQLErrors(graphQLErrors);
    }
    if (!R.isNil(networkError)) {
      onNetworkError && onNetworkError(networkError);
    }
  });

export { getErrorLink };
