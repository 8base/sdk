import React from 'react';
import TestRenderer from 'react-test-renderer';
import { getDisplayName } from '@8base-react/utils';
import { SubscribableDecorator } from '@8base/auth';

import { AuthProvider, withAuth, WithAuthProps } from '../../src';
import { DummyAuthClient } from '../utils';

type StubComponentProps = {
  foo: number;
} & WithAuthProps;

const NotAuthorizedComponent = () => <span>I am not authorized</span>;

const AuthorizedComponent = () => <span>I am authorized</span>;

const StubComponent = ({ auth: { isAuthorized }, foo }: StubComponentProps) => (
  <div>
    {isAuthorized ? <AuthorizedComponent /> : <NotAuthorizedComponent />}
    {foo}
  </div>
);

const EnhancedStubComponent = withAuth(StubComponent);

describe('withAuth', () => {
  const authClient = DummyAuthClient();
  const subscribableAuthClient = SubscribableDecorator.decorate(authClient);
  const testRenderer = TestRenderer.create(
    <AuthProvider authClient={subscribableAuthClient}>
      <EnhancedStubComponent foo={42} />
    </AuthProvider>,
  );
  const testInstance = testRenderer.root;

  it('sets wrapped display name for HOC', () => {
    expect(getDisplayName(EnhancedStubComponent)).toBe('withAuth(StubComponent)');
  });

  it('passes auth props to an enhanced component', () => {
    const { props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(false);
    expect(props.auth.authState).toEqual({});
  });

  it('passes all other props to an enhanced component', () => {
    const { props } = testInstance.findByType(StubComponent);

    expect(props.foo).toBe(42);
  });
});
