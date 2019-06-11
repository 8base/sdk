import gql from 'graphql-tag';
import {
  ApolloClientOptions as OriginalApolloClientOptions,
  ApolloClient as OriginalApolloClient,
} from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Operation } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { AuthLink, SuccessLink, SignUpLink } from '@8base/apollo-links';
import { onError as createErrorLink, ErrorHandler } from 'apollo-link-error';
import { AuthState, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

type ApolloClientCommon = {
  uri: string;
  extendLinks?: (links: ApolloLink[], options: { getAuthState?: () => Promise<AuthState> }) => ApolloLink[];
  onAuthError?: (error?: {}) => void;
  onIdTokenExpired?: () => Promise<any>;
  onRequestSuccess?: (options: { operation: Operation; data: any }) => void;
  onRequestError?: ErrorHandler;
} & Partial<OriginalApolloClientOptions<any>>;

type ApolloClientOptions = {
  withAuth?: boolean;
  autoSignUp?: boolean;
  authProfileId?: string;
  getAuthState?: () => Promise<AuthState>;
  getRefreshTokenParameters?: Function;
  onAuthSuccess?: Function;
} & ApolloClientCommon;

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
class ApolloClient extends OriginalApolloClient<Object> {
  constructor(config: ApolloClientOptions) {
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
      autoSignUp = false,
      authProfileId,
      ...rest
    } = config;

    let { cache } = config;

    if (!cache) {
      cache = new InMemoryCache();
    }

    const batchHttpLink = new BatchHttpLink({ uri });

    let links: ApolloLink[] = [batchHttpLink];

    if (withAuth) {
      const authLink = new AuthLink({
        // @ts-ignore
        getAuthState,
        // @ts-ignore. Needs to check and remove this parameter.
        getRefreshTokenParameters,
        onAuthError,
        onAuthSuccess,
        onIdTokenExpired,
      });

      links = [authLink, ...links];

      if (autoSignUp) {
        if (!authProfileId) {
          throw new SDKError(
            ERROR_CODES.MISSING_PARAMETER,
            PACKAGES.APOLLO_CLIENT,
            'Please provide authProfileId if you want to enable auto sign up.',
          );
        }

        const signUpLink = new SignUpLink({
          authProfileId,
          // @ts-ignore
          getAuthState,
        });

        links = [signUpLink, ...links];
      }
    }

    if (typeof onRequestSuccess === 'function') {
      links = [new SuccessLink({ successHandler: onRequestSuccess }), ...links];
    }

    if (typeof onRequestError === 'function') {
      links = [createErrorLink(onRequestError), ...links];
    }

    if (typeof extendLinks === 'function') {
      links = extendLinks(links, { getAuthState });
    }

    const link = ApolloLink.from(links);

    super({ cache, link, ...rest });
  }
}

export { ApolloClient, gql, InMemoryCache };
