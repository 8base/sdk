// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { getDisplayName } from 'recompose';

import { AuthProvider, Auth0WebClient, withAuth } from '../../src';

type StubComponentProps = {
  auth: {
    isAuthorized: boolean,
  },
  foo: number,
};

const StubComponent = ({ auth: { isAuthorized }, foo }: StubComponentProps) => (
  <div>
    { isAuthorized ? 'I am authorized :)' : 'I am not authorized :(' }
    { foo }
  </div>
);

const EnhancedStubComponent = withAuth(StubComponent);

const authClient = new Auth0WebClient({
  domain: 'domain',
  clientID: 'clientID',
  redirectUri: 'redirectUri',
});

const getTestInstance = ({ foo }) => {
  const testRenderer = TestRenderer.create(
    <AuthProvider authClient={ authClient }>
      <EnhancedStubComponent foo={ foo } />
    </AuthProvider>,
  );
  const testInstance = testRenderer.root;

  return testInstance;
};

describe('As a developer, i can use withAuth HOC to get auth context', () => {
  it('sets wrapped display name for HOC', () => {
    expect(getDisplayName(EnhancedStubComponent)).toBe('withAuth(StubComponent)');
  });

  it('adds isAuthorized prop', () => {
    const workspaceId = 'some workspace id';
    const idToken = 'some id token';
    const foo = 42;
    const testInstance = getTestInstance({ foo });

    const { auth } = testInstance.findByType(StubComponent).props;

    auth.setAuthState({ workspaceId, token: idToken });

    const updatedProps = testInstance.findByType(StubComponent).props;

    expect(updatedProps.foo).toBe(foo);
    expect(updatedProps.auth.isAuthorized).toBeTruthy();
    expect(updatedProps.auth.authState).toEqual({
      workspaceId,
      token: idToken,
    });
  });
});

