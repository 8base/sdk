// @flow

import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AuthProvider, withLogout, WithAuthProps } from '../../src';
import { SampleAuthClient } from '../utils';

type StubComponentProps = {
  foo: number,
} & WithAuthProps;

const NotAuthorizedComponent = () => <span>I am not authorider</span>;

const AuthorizedComponent = () => <span>I am authorized</span>;

const StubComponent: any = ({ auth: { isAuthorized }, foo }: StubComponentProps) => (
  <div>
    { isAuthorized ? <AuthorizedComponent /> : <NotAuthorizedComponent /> }
    { foo }
  </div>
);

const EnhancedStubComponent: any = withLogout(StubComponent);

describe('withLogout', () => {
  const authClient = new SampleAuthClient();
  const apolloClient = new ApolloClient({
    // @ts-ignore
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

