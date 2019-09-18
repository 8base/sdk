import React from 'react';
import { ISubscribableAuthClient } from '@8base/auth';
import { AuthProvider } from '@8base/react-auth';
import { ApolloContainer } from './ApolloContainer';
import { ApolloContainerPassedProps } from './types';
import { TableSchemaProvider } from '@8base/table-schema-provider';

export type AppProviderProps = ApolloContainerPassedProps & {
  authClient?: ISubscribableAuthClient;
  children:
    | React.ReactNode
    | ((renderProps: { loading: boolean }) => React.ReactNode);
};

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
}: AppProviderProps): any =>
  !!authClient ? (
    <AuthProvider authClient={authClient}>
      <ApolloContainer
        withAuth={true}
        withSubscriptions={withSubscriptions}
        uri={uri}
        extendLinks={extendLinks}
        onRequestSuccess={onRequestSuccess}
        onRequestError={onRequestError}
        autoSignUp={autoSignUp}
        authProfileId={authProfileId}
        introspectionQueryResultData={introspectionQueryResultData}
      >
        <TableSchemaProvider
          tablesList={tablesList}
          applicationsList={applicationsList}
        >
          {children}
        </TableSchemaProvider>
      </ApolloContainer>
    </AuthProvider>
  ) : (
    <ApolloContainer
      withAuth={false}
      withSubscriptions={withSubscriptions}
      uri={uri}
      extendLinks={extendLinks}
      onRequestSuccess={onRequestSuccess}
      onRequestError={onRequestError}
      introspectionQueryResultData={introspectionQueryResultData}
    >
      <TableSchemaProvider
        tablesList={tablesList}
        applicationsList={applicationsList}
      >
        {children}
      </TableSchemaProvider>
    </ApolloContainer>
  );

export { AppProvider };
