// @flow

import * as R from 'ramda';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { FileUploadLink } from '@8base/sdk';

import { getAuthLink } from './authLink';
import { getTokenRefreshLink } from './tokenRefreshLink';
import { getErrorLink } from './errorLink';
import type { AuthState, GetTokenRefreshLinkParams, GetErrorLinkParams } from '../types';

/**
 * Interface of the createApolloLinks options
 */
type CreateApolloLinksParams = {
  uri: string,
  getAuthState?: () => AuthState,

  links?: {
    tokenRefresh?: GetTokenRefreshLinkParams,
    fileUpload?: {
      enable?: boolean,
    },
    error?: GetErrorLinkParams & {
      enable?: boolean,
    },
    batchHttp?: {
      enable?: boolean,
    }
  }
}

/**
 * Creates apollo links for the 8base backend service.
 *
 * @param config Options to create apollo links.
 * @param config.getAuthState Function to return the application auth state. Needs for the auth links.
 * @param config.uri Endpoint of the 8base backend.
 * @param config.link Links settings.
 *
 * @param config.link.tokenRefresh Options to configure token refresh links which update auth tokens.
 * @param [config.link.tokenRefresh.enable=true] When true then enable link.
 * @param config.link.tokenRefresh.onUpdateTokenFail Callback executed on token update fail.
 * @param config.link.tokenRefresh.onUpdateTokenSuccess Callback executed on token update successfully completes.
 * @param config.link.tokenRefresh.onIdTokenExpired Callback executed on expired id token.
 *
 * @param config.link.fileUpload Options to configure upload link which loads files on amazon s3.
 * @param [config.link.fileUpload.enable=true] When true then enable link.
 *
 * @param config.link.auth Options to configure auth link which add the headers to the request.
 * @param [config.link.auth.enable=true] When true then enable link.
 *
 * @param config.link.error Options to configure error link which pass errors by the callbacks.
 * @param [config.link.error.enable=true] When true then enable link.
 * @param config.link.error.onGraphQLErrors Callback executed on request fail with graphql error.
 * @param config.link.error.onNetworkError Callback executed on request fail with network error.
 *
 * @param config.link.batchHttp Options to configure [batch http link.](https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-batch-http)
 * @param [config.link.batchHttp.enable=true] When true then enable link.
 */
const createApolloLinks = (config: CreateApolloLinksParams) => {
  const {
    getAuthState,
    uri,
    links = {},
  } = config;
  const apolloLinks: ApolloLink[] = [];


  const DEFAULT_ENABLE_LINKS = {
    fileUpload: true,
    error: true,
    batchHttp: true,
  };

  const isEnableLink = (linkKey: string): boolean =>
    R.pathOr(DEFAULT_ENABLE_LINKS[linkKey], [linkKey, 'enable'], (links: Object));


  if (isEnableLink('fileUpload')) {
    apolloLinks.push(
      new FileUploadLink(),
    );
  }

  apolloLinks.push(
    getTokenRefreshLink({
      ...links.tokenRefresh,
      getAuthState,
    }),
  );

  apolloLinks.push(
    getAuthLink({ getAuthState }),
  );

  if (isEnableLink('error')) {
    apolloLinks.push(
      getErrorLink({ ...links.error }),
    );
  }

  if (isEnableLink('batchHttp')) {
    apolloLinks.push(
      new BatchHttpLink({ uri }),
    );
  }

  return apolloLinks;
};

export { createApolloLinks };
