// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AuthProvider, withLogout, type AuthProps } from '../../src';
import { SampleAuthClient } from '../utils';

type StubComponentProps = {
  foo: number,
} & AuthProps;

const NotAuthorizedComponent = () => 'I am not authorider';

const AuthorizedComponent = () => 'I am authorized';

const StubComponent = ({ auth: { isAuthorized }, foo }: StubComponentProps) => (
  <div>
    { isAuthorized ? <AuthorizedComponent /> : <NotAuthorizedComponent /> }
    { foo }
  </div>
);

const EnhancedStubComponent = withLogout(StubComponent);

describe('withLogout', () => {
  const authClient = new SampleAuthClient();
  const apolloClient = new ApolloClient({
    link: () => Observable.of(),
    cache: new InMemoryCache(),
  });
  const testRenderer = TestRenderer.create(
    <ApolloProvider client={ apolloClient }>
      <AuthProvider authClient={ authClient }>
        <EnhancedStubComponent foo={ 42 } />
      </AuthProvider>,
    </ApolloProvider>,
  );
  const testInstance = testRenderer.root;

  it('passes logout method to an enhanced component', async () => {
    const { props } = testInstance.findByType(StubComponent);

    expect(typeof props.logout).toBe('function');

    await props.logout();

    expect(authClient.purgeAuthState).toHaveBeenCalled();
  });

  it('passes all other props to an enhanced component', async () => {
    const { props } = testInstance.findByType(StubComponent);

    expect(props.foo).toBe(42);
  });
});

