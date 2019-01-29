// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { getDisplayName } from 'recompose';

import { AuthProvider, withAuth, type AuthProps } from '../../src';

const SampleAuthClient = function () {
  let authState = {};

  const purgeAuthState = jest.fn(async () => {
    authState = {};
  });
  const setAuthState = jest.fn(async (state) => {
    authState = state;
  });
  const getAuthState = jest.fn(async () => {
    return authState;
  });
  const checkIsAuthorized = jest.fn(async () => {
    return !!authState.token;
  });

  this.purgeAuthState = purgeAuthState;
  this.setAuthState = setAuthState;
  this.getAuthState = getAuthState;
  this.checkIsAuthorized = checkIsAuthorized;
};

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

