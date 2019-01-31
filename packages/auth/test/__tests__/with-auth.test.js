// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { getDisplayName } from 'recompose';

import { AuthProvider, withAuth, type AuthProps } from '../../src';
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

const EnhancedStubComponent = withAuth(StubComponent);

describe('withAuth', () => {
  const authClient = new SampleAuthClient();
  const testRenderer = TestRenderer.create(
    <AuthProvider authClient={ authClient }>
      <EnhancedStubComponent foo={ 42 } />
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

