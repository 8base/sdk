import { AppProvider, FragmentsSchemaContainer, AuthProvider, AuthContext, withAuth } from '@8base/app-provider';
import { ApolloClient, gql, InMemoryCache } from '@8base/apollo-client';

describe('@8base/react-sdk', () => {
  const reactSDK = require('../../src');

  it('exports AppProvider', () => {
    expect(reactSDK.AppProvider).toBe(AppProvider);
  });

  it('exports FragmentsSchemaContainer', () => {
    expect(reactSDK.FragmentsSchemaContainer).toBe(FragmentsSchemaContainer);
  });

  it('exports AuthProvider', () => {
    expect(reactSDK.AuthProvider).toBe(AuthProvider);
  });

  it('exports AuthContext', () => {
    expect(reactSDK.AuthContext).toBe(AuthContext);
  });

  it('exports withAuth', () => {
    expect(reactSDK.withAuth).toBe(withAuth);
  });

  it('exports ApolloClient', () => {
    expect(reactSDK.ApolloClient).toBe(ApolloClient);
  });

  it('exports gql', () => {
    expect(reactSDK.gql).toBe(gql);
  });

  it('exports InMemoryCache', () => {
    expect(reactSDK.InMemoryCache).toBe(InMemoryCache);
  });
});
