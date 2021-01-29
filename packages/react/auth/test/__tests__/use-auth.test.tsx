import React from 'react';
import TestRenderer from 'react-test-renderer';
import { SubscribableDecorator } from '@8base/auth';

import { AuthProvider, useAuth } from '../../src';
import { DummyAuthClient } from '../utils';

const StubComponent = (props: any) => <div />;

const EnhancedStubComponent = () => {
  const auth = useAuth();

  return <StubComponent auth={auth} />;
};

describe('useAuth', () => {
  it('passes auth props to an component', () => {
    const authClient = DummyAuthClient();
    const subscribableAuthClient = SubscribableDecorator.decorate(authClient);
    const testRenderer = TestRenderer.create(
      <AuthProvider authClient={subscribableAuthClient}>
        <EnhancedStubComponent />
      </AuthProvider>,
    );
    const testInstance = testRenderer.root;

    const { props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(false);
    expect(props.auth.authState).toEqual({});
  });
});
