// @flow

import gql from 'graphql-tag';
import { type ApolloClientOptions, ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { AuthLink, SuccessLink } from '@8base/apollo-links';
import { onError as createErrorLink } from 'apollo-link-error';


type EightBaseApolloClientCommon = {
  uri: string,
  extendLinks?: (links: Object[]) => Object[],
  onAuthError?: Function,
  onIdTokenExpired?: Function,
  onRequestSuccess?: Function,
  onRequestError?: Function,
} & $Shape<ApolloClientOptions>;

type EightBaseApolloClientWithAuthOptions = {
  withAuth?: true,
  getAuthState: Function,
  getRefreshTokenParameters: Function,
  onAuthSuccess: Function,
} & EightBaseApolloClientCommon;


type EightBaseApolloClientOptions = {
  withAuth: false,
} & EightBaseApolloClientCommon;


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
 * @param {Function} [config.onRequestSuccess] - The callback which called when request is success.
 * @param {Function} [config.onRequestError] - The callback which called when request is fail.
 * @param {Function} [config.extendLinks] - Function to extend standart array of the links.
 *
 * @return instance of the Apollo Client
 */
class EightBaseApolloClient extends ApolloClient {
  constructor(config: EightBaseApolloClientOptions | EightBaseApolloClientWithAuthOptions) {
    const {
      uri,
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
      onRequestSuccess,
      onRequestError,
      extendLinks,
      withAuth = true,
      ...rest
    } = config;

    let { cache } = config;

    if (!cache) {
      cache = new InMemoryCache();
    }

    const batchHttpLink = new BatchHttpLink({ uri });


    let links = [batchHttpLink];

    if (withAuth) {
      const authLink = new AuthLink({
        getAuthState,
        getRefreshTokenParameters,
        onAuthSuccess,
        onAuthError,
        onIdTokenExpired,
      });

      links = [authLink, ...links];
    }

    if (typeof onRequestSuccess === 'function') {
      links = [new SuccessLink({ successHandler: onRequestSuccess }), ...links];
    }

    if (typeof onRequestError === 'function') {
      links = [createErrorLink(onRequestError), ...links];
    }

    if (typeof extendLinks === 'function') {
      links = extendLinks(links);
    }

    const link = ApolloLink.from(links);

    super({ cache, link, ...rest });
  }
}

export { EightBaseApolloClient, gql, InMemoryCache };
