// @flow

import gql from 'graphql-tag';
import { type ApolloClientOptions, ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createAuthLink, fileUploadLink, SubscriptionLink } from '@8base/apollo-links';

type EightBaseApolloClientOptions = {
  uri: string,
  getAuthState: Function,
  getRefreshTokenParameters: Function,
  onAuthSuccess: Function,
  onAuthError?: Function,
  onIdTokenExpired?: Function,
} & ApolloClientOptions;

/**
 * Extended Apollo Client by 8base several links.
 *
 * @param {Object} config - The Apollo Client config.
 * @param {string} config.uri Endpoint of the GraphQl server.
 * @param {Function} config.getAuthState - The function which are using to get auth state.
 * @param {Function} config.getRefreshTokenParameters - The function which are using for get refresh token parameters.
 * @param {Function} config.onAuthSuccess - The callback which called when attempt to refresh authentication is success.
 * @param {Function} [config.onAuthError] - The callback which called when attempt to refresh authentication is failed.
 * @param {Function} [config.onIdTokenExpired] - The callback which called when id token is expired.
 *
 * @return instance of the Apollo Client
 */
class EightBaseApolloClient extends ApolloClient {
  constructor(config: EightBaseApolloClientOptions) {
    const {
      uri,
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
    } = config;

    let { cache } = config;

    if (!cache) {
      cache = new InMemoryCache();
    }

    const authLink = createAuthLink({
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
    });

    const subscriptionLink = new SubscriptionLink();

    const batchHttpLink = new BatchHttpLink({ uri });

    const link = ApolloLink.from([
      fileUploadLink,
      authLink,
      subscriptionLink,
      batchHttpLink,
    ]);

    super({ cache, link });
  }
}

export { EightBaseApolloClient, gql, InMemoryCache };
