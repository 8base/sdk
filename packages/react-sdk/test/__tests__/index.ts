import {
  AppProvider,
  FragmentsSchemaContainer,
  AuthProvider,
  AuthContext,
  withAuth,
  withLogout,
} from '@8base/app-provider';
import { ApolloClient, gql, InMemoryCache } from '@8base/apollo-client';
import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';

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

  it('exports withLogout', () => {
    expect(reactSDK.withLogout).toBe(withLogout);
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

  it('exports WebAuth0AuthClient', () => {
    expect(reactSDK.WebAuth0AuthClient).toBe(WebAuth0AuthClient);
  });
});
