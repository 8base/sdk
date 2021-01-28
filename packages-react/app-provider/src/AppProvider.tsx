import React from 'react';
import { ISubscribableAuthClient } from '@8base/auth';
import { AuthProvider } from '@8base-react/auth';
import { TableSchemaProvider } from '@8base-react/table-schema-provider';
import { ApolloError } from '@apollo/client';
import { Optional } from 'utility-types';

import { ApolloContainer, ApolloContainerProps } from './ApolloContainer';
import { ApolloContainerPassedProps } from './types';

export type AppProviderProps = ApolloContainerPassedProps & {
  authClient?: ISubscribableAuthClient;
  children:
    | React.ReactNode
    | ((renderProps: {
        loading: boolean;
        error?: ApolloError;
      }) => React.ReactNode);
};

type PrefilledApolloContainerProps =
  | 'withSubscriptions'
  | 'uri'
  | 'extendLinks'
  | 'onRequestSuccess'
  | 'onRequestError'
  | 'introspectionQueryResultData'
  | 'cacheOptions'
  | 'children';

/**
 * `AppProvider` universal provider which loads fragments schema and provides Apollo client with it, authentication and table schema.
 * @prop {string} [uri] - The 8base API field schema.
 * @prop {Object} [authClient] - The 8base auth client.
 * @prop {Function} [onRequestSuccess] - The callback which called when request is success.
 * @prop {Function} [onRequestError] - The callback which called when request is fail.
 * @prop {Function} [extendLinks] - Function to extend standart array of the links.
 * @prop {Function|React.ReactNode} [children] - The render function or React nodes.
 * @prop {Object} [introspectionQueryResultData] - The fragment type for introspection fragments matcher.
 * @prop {Object} [tablesList] - The schema of the 8base tables.
 * @prop {Object} [cacheOptions] - Apollo InMemoryCache options.
 */
const AppProvider = ({
  uri,
  authClient,
  onRequestSuccess,
  onRequestError,
  extendLinks,
  children,
  autoSignUp,
  authProfileId,
  introspectionQueryResultData,
  tablesList,
  applicationsList,
  withSubscriptions,
  cacheOptions,
}: AppProviderProps): any => {
  const renderApolloContainer = (
    apolloContainerProps: Optional<
      ApolloContainerProps,
      PrefilledApolloContainerProps
    >,
  ) => (
    <ApolloContainer
      withSubscriptions={withSubscriptions}
      uri={uri}
      extendLinks={extendLinks}
      onRequestSuccess={onRequestSuccess}
      onRequestError={onRequestError}
      introspectionQueryResultData={introspectionQueryResultData}
      cacheOptions={cacheOptions}
      {...apolloContainerProps}
    >
      <TableSchemaProvider
        tablesList={tablesList}
        applicationsList={applicationsList}
      >
        {children}
      </TableSchemaProvider>
    </ApolloContainer>
  );

  return !!authClient ? (
    <AuthProvider authClient={authClient}>
      {renderApolloContainer({
        withAuth: true,
        autoSignUp,
        authProfileId,
      })}
    </AuthProvider>
  ) : (
    renderApolloContainer({ withAuth: false })
  );
};

export { AppProvider };
