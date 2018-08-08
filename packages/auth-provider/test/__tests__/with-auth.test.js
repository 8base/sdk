import React from 'react';
import TestRenderer from 'react-test-renderer';
import { getDisplayName } from 'recompose';

import { AuthProvider, withAuth } from '../../src';

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

const getTestInstance = ({ foo }) => {
  const testRenderer = TestRenderer.create(
    <AuthProvider>
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
    const accountId = 'some account id';
    const idToken = 'some id token';
    const foo = 42;
    const testInstance = getTestInstance({ foo });

    const { auth } = testInstance.findByType(StubComponent).props;

    auth.setAuthState({ accountId, idToken });

    const updatedProps = testInstance.findByType(StubComponent).props;

    expect(updatedProps.foo).toBe(foo);
    expect(updatedProps.auth.isAuthorized).toBeTruthy();
    expect(updatedProps.auth.authState).toEqual({
      accountId,
      idToken,
    });
  });
});
