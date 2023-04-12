import React from 'react';
import TestRenderer from 'react-test-renderer';

import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';
import { ApolloClient } from '@8base/apollo-client';
import { AuthProvider } from '@8base/react-auth';

import { AppProvider } from '../../src';

jest.mock('../../src/FragmentsSchemaContainer', () => ({
  FragmentsSchemaContainer: ({ children }: any) => (
    <div>{children({ loading: false })}</div>
  ),
}));

jest.mock('@8base/react-auth', () => ({
  AuthProvider: jest.fn(({ children }) => <div>{children}</div>),
  withAuth: jest.fn((Component) => (props: any) => <Component {...props} />),
}));

jest.mock('@8base/apollo-client', () => {
  const { ApolloClient, InMemoryCache, ApolloLink } = require('@apollo/client');

  return {
    ApolloClient: jest.fn(
      () =>
        new ApolloClient({
          cache: new InMemoryCache(),
          link: ApolloLink.from([]),
        }),
    ),
  };
});

describe('AppProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render App Provider and pass props to the client', () => {
    const extendLinks = jest.fn();
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();
    const uri = 'http://8base.com';

    const authClient: any = new WebAuth0AuthClient({
      domain: 'qweqwe',
      clientId: 'asdad',
      redirectUri: `${window.location.origin}/auth/callback`,
      logoutRedirectUri: `${window.location.origin}/auth`,
    });

    TestRenderer.create(
      <AppProvider
        uri={uri}
        authClient={authClient}
        extendLinks={extendLinks}
        onRequestError={onRequestError}
        onRequestSuccess={onRequestSuccess}
        autoSignUp={true}
        authProfileId="someProfileId"
      >
        {() => <div />}
      </AppProvider>,
    );

    const {
      cache,
      ...apolloClientProps
    } = (ApolloClient as any).mock.calls[0][0];

    expect(ApolloClient).toHaveBeenCalled();
    expect(apolloClientProps.extendLinks).toEqual(extendLinks);
    expect(apolloClientProps.onRequestError).toEqual(onRequestError);
    expect(apolloClientProps.onRequestSuccess).toEqual(onRequestSuccess);

    expect(apolloClientProps).toMatchInlineSnapshot(`
      Object {
        "authProfileId": "someProfileId",
        "autoSignUp": true,
        "extendLinks": [MockFunction],
        "getAuthState": [Function],
        "onAuthError": [Function],
        "onIdTokenExpired": [Function],
        "onRequestError": [MockFunction],
        "onRequestSuccess": [MockFunction],
        "uri": "http://8base.com",
        "withAuth": true,
        "withBatching": true,
        "withSubscriptions": false,
      }
    `);
  });

  it('should render App Provider with auth', () => {
    const extendLinks = jest.fn();
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();
    const uri = 'http://8base.com';

    const authClient: any = new WebAuth0AuthClient({
      domain: 'qweqwe',
      clientId: 'asdad',
      redirectUri: `${window.location.origin}/auth/callback`,
      logoutRedirectUri: `${window.location.origin}/auth`,
    });

    const wrapper = TestRenderer.create(
      <AppProvider
        uri={uri}
        authClient={authClient}
        extendLinks={extendLinks}
        onRequestError={onRequestError}
        onRequestSuccess={onRequestSuccess}
        autoSignUp={false}
      >
        {() => <div />}
      </AppProvider>,
    );

    const {
      cache,
      ...apolloClientProps
    } = (ApolloClient as any).mock.calls[0][0];

    expect(AuthProvider).toHaveBeenCalled();
    const authClientProps = wrapper.root.findByType(AuthProvider).props
      .authClient;

    expect(authClientProps).toEqual(authClient);

    expect(ApolloClient).toHaveBeenCalled();
    expect(apolloClientProps.withAuth).toBeTruthy();

    expect(apolloClientProps).toMatchInlineSnapshot(`
      Object {
        "authProfileId": undefined,
        "autoSignUp": false,
        "extendLinks": [MockFunction],
        "getAuthState": [Function],
        "onAuthError": [Function],
        "onIdTokenExpired": [Function],
        "onRequestError": [MockFunction],
        "onRequestSuccess": [MockFunction],
        "uri": "http://8base.com",
        "withAuth": true,
        "withBatching": true,
        "withSubscriptions": false,
      }
    `);
  });

  it('should render App Provider without auth', () => {
    const uri = 'http://8base.com';
    const extendLinks = jest.fn();
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();

    TestRenderer.create(
      <AppProvider
        uri={uri}
        extendLinks={extendLinks}
        onRequestError={onRequestError}
        onRequestSuccess={onRequestSuccess}
      >
        {() => <div />}
      </AppProvider>,
    );

    const {
      cache,
      ...apolloClientProps
    } = (ApolloClient as any).mock.calls[0][0];

    expect(AuthProvider).not.toHaveBeenCalled();
    expect(ApolloClient).toHaveBeenCalled();
    expect(apolloClientProps.withAuth).toBeFalsy();

    expect(apolloClientProps).toMatchInlineSnapshot(`
      Object {
        "extendLinks": [MockFunction],
        "onRequestError": [MockFunction],
        "onRequestSuccess": [MockFunction],
        "uri": "http://8base.com",
        "withAuth": false,
        "withBatching": true,
        "withSubscriptions": false,
      }
    `);
  });

  it('should pass `cacheOptions` to apollo cache', () => {
    const uri = 'http://8base.com';
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();
    const cacheOptions = {
      typePolicies: {
        Query: {
          fields: {
            test: jest.fn(),
          },
        },
      },
    };

    TestRenderer.create(
      <AppProvider
        uri={uri}
        onRequestError={onRequestError}
        onRequestSuccess={onRequestSuccess}
        cacheOptions={cacheOptions}
      >
        {() => <div />}
      </AppProvider>,
    );

    const { cache } = (ApolloClient as any).mock.calls[0][0];

    expect(ApolloClient).toHaveBeenCalled();

    expect(cache.config).toMatchInlineSnapshot(`
      Object {
        "addTypename": true,
        "dataIdFromObject": [Function],
        "resultCaching": true,
        "typePolicies": Object {
          "Query": Object {
            "fields": Object {
              "test": [MockFunction],
            },
          },
        },
      }
    `);
  });
});
