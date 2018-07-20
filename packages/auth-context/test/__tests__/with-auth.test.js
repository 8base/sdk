import React from 'react';
import TestRenderer from 'react-test-renderer';
import { getDisplayName } from 'recompose';

import { AuthContext, withAuth } from '../../src';

type StubComponentProps = {
  isAuthorized: boolean,
  foo: number,
};

const StubComponent = ({ isAuthorized, foo }: StubComponentProps) => (
  <div>
    { isAuthorized ? 'I am authorized :)' : 'I am not authorized :(' }
    { foo }
  </div>
);

const EnhancedStubComponent = withAuth(StubComponent);

const getTestInstance = ({ accountId, idToken }, { foo }) => {
  const testRenderer = TestRenderer.create(
    <AuthContext.Provider idToken={ idToken } accountId={ accountId } >
      <EnhancedStubComponent foo={ foo } />
    </AuthContext.Provider>,
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
    const testInstance = getTestInstance({ accountId, idToken }, { foo });

    expect(testInstance.findByType(StubComponent).props).toEqual({
      isAuthorized: true,
      foo,
    });
  });
});
