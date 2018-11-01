import React from 'react';
import { TableSchemaProvider } from '@8base/table-schema-provider';
import { AuthProvider } from '@8base/auth';

import { ApolloContainer } from './ApolloContainer';

type EightBaseAppProviderProps = {
  uri: string,
  children: ({ loading: boolean }) => React$Node,
  authDomain: string,
  authClientId: string,
  authRedirectUri: string,
};

/**
 * `EightBaseAppProvider` universal provider which loads fragments schema and provides Apollo client with it, authentication and table schema.
 * @prop {string} [uri] - The 8base API field schema.
 * @prop {Function} [children] - The render function.
 */
const EightBaseAppProvider = ({ uri, authDomain, authClientId, authRedirectUri, children }: EightBaseAppProviderProps) => (
  <AuthProvider domain={ authDomain } clientID={ authClientId } redirectUri={ authRedirectUri }>
    <ApolloContainer uri={ uri }>
      <TableSchemaProvider>
        { children }
      </TableSchemaProvider>
    </ApolloContainer>
  </AuthProvider>
);

export { EightBaseAppProvider };
