// @flow

import React from 'react';
import { mount } from 'enzyme';

import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';
import { EightBaseApolloClient } from '@8base/apollo-client';
import { AuthProvider } from '@8base/auth';

import { EightBaseAppProvider } from '../../src';

jest.mock('../../src/FragmentsSchemaContainer', () => ({
  FragmentsSchemaContainer: ({ children }) => (
    <div>{ children({ loading: false }) }</div>
  ),
}));

jest.mock('@8base/auth', () => ({
  AuthProvider: jest.fn(({ children }) => <div>{ children }</div>),
  withAuth: jest.fn(Component => props => <Component { ...props } />),
}));

jest.mock('@8base/apollo-client', () => {
  const { ApolloClient } = require('apollo-client');
  const { InMemoryCache } = require('apollo-cache-inmemory');
  const { ApolloLink } = require('apollo-link');

  return {
    EightBaseApolloClient: jest.fn(
      () =>
        new ApolloClient({
          cache: new InMemoryCache(),
          link: ApolloLink.from([]),
        }),
    ),
  };
});


describe('EightBaseAppProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render App Provider and pass props to the client', () => {
    const extendLinks = jest.fn();
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();
    const uri = 'http://8base.com';

    const authClient = new WebAuth0AuthClient({
      domain: 'qweqwe',
      clientId: 'asdad',
      redirectUri: `${window.location.origin}/auth/callback`,
      logoutRedirectUri: `${window.location.origin}/auth`,
    });

    mount(
      <EightBaseAppProvider
        uri={ uri }
        authClient={ authClient }
        extendLinks={ extendLinks }
        onRequestError={ onRequestError }
        onRequestSuccess={ onRequestSuccess }
      >
        { () => <div /> }
      </EightBaseAppProvider>,
    );

    const {
      cache,
      ...apolloClientProps
    } = EightBaseApolloClient.mock.calls[0][0];

    expect(EightBaseApolloClient).toHaveBeenCalled();
    expect(apolloClientProps.extendLinks).toEqual(extendLinks);
    expect(apolloClientProps.onRequestError).toEqual(onRequestError);
    expect(apolloClientProps.onRequestSuccess).toEqual(onRequestSuccess);

    expect(apolloClientProps).toMatchInlineSnapshot(`
Object {
  "extendLinks": [MockFunction],
  "getAuthState": [Function],
  "onAuthError": [Function],
  "onRequestError": [MockFunction],
  "onRequestSuccess": [MockFunction],
  "uri": "http://8base.com",
  "withAuth": true,
}
`);
  });


  it('should render App Provider with auth', () => {
    const extendLinks = jest.fn();
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();
    const uri = 'http://8base.com';

    const authClient = new WebAuth0AuthClient({
      domain: 'qweqwe',
      clientId: 'asdad',
      redirectUri: `${window.location.origin}/auth/callback`,
      logoutRedirectUri: `${window.location.origin}/auth`,
    });

    const wrapper = mount(
      <EightBaseAppProvider
        uri={ uri }
        authClient={ authClient }
        extendLinks={ extendLinks }
        onRequestError={ onRequestError }
        onRequestSuccess={ onRequestSuccess }
      >
        { () => <div /> }
      </EightBaseAppProvider>,
    );

    const {
      cache,
      ...apolloClientProps
    } = EightBaseApolloClient.mock.calls[0][0];


    expect(AuthProvider).toHaveBeenCalled();
    expect(wrapper.find(AuthProvider).prop('authClient')).toEqual(authClient);

    expect(EightBaseApolloClient).toHaveBeenCalled();
    expect(apolloClientProps.withAuth).toBeTruthy();

    expect(apolloClientProps).toMatchInlineSnapshot(`
Object {
  "extendLinks": [MockFunction],
  "getAuthState": [Function],
  "onAuthError": [Function],
  "onRequestError": [MockFunction],
  "onRequestSuccess": [MockFunction],
  "uri": "http://8base.com",
  "withAuth": true,
}
`);
  });


  it('should render App Provider without auth', () => {
    const uri = 'http://8base.com';
    const extendLinks = jest.fn();
    const onRequestError = jest.fn();
    const onRequestSuccess = jest.fn();

    mount(
      <EightBaseAppProvider
        uri={ uri }
        extendLinks={ extendLinks }
        onRequestError={ onRequestError }
        onRequestSuccess={ onRequestSuccess }
      >
        { () => <div /> }
      </EightBaseAppProvider>,
    );

    const {
      cache,
      ...apolloClientProps
    } = EightBaseApolloClient.mock.calls[0][0];

    expect(AuthProvider).not.toHaveBeenCalled();
    expect(EightBaseApolloClient).toHaveBeenCalled();
    expect(apolloClientProps.withAuth).toBeFalsy();

    expect(apolloClientProps).toMatchInlineSnapshot(`
Object {
  "extendLinks": [MockFunction],
  "onRequestError": [MockFunction],
  "onRequestSuccess": [MockFunction],
  "uri": "http://8base.com",
  "withAuth": false,
}
`);
  });
});
