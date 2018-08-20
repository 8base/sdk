// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AuthProvider, AuthConsumer } from '../../src';

type StubComponentProps = {
  auth: {
    isAuthorized: boolean,
    setAuthState: Function,
    authState: Object,
  },
};

const StubComponent = ({ auth: { isAuthorized }}: StubComponentProps) => (
  <div>
    { isAuthorized ? 'I am authorized :)' : 'I am not authorized :(' }
  </div>
);

const getTestInstance = () => {
  const testRenderer = TestRenderer.create(
    <AuthProvider>
      <AuthConsumer>
        {
          (auth: any) => (
            <StubComponent auth={ auth } />
          )
        }
      </AuthConsumer>
    </AuthProvider>,
  );
  const testInstance = testRenderer.root;

  return testInstance;
};

describe('As a developer, i can use AuthContext to get authorization state in any place of react tree', () => {
  it('sets isAuthorized=true if there are valid accountId and idToken', () => {
    const accountId = 'some account id';
    const idToken = 'some id token';
    const testInstance = getTestInstance();
    const { setAuthState } = testInstance.findByType(StubComponent).props.auth;

    setAuthState({ accountId, idToken });
    expect(testInstance.findByType(StubComponent).props.auth.isAuthorized).toBe(true);
  });

  it('sets isAuthorized=false if there is an invalid prop', () => {
    const accountId = 'some account id';
    const idToken = undefined;
    const testInstance = getTestInstance();
    const { setAuthState } = testInstance.findByType(StubComponent).props.auth;

    setAuthState({ accountId, idToken });
    expect(testInstance.findByType(StubComponent).props.auth.isAuthorized).toBe(false);
  });

  it('merges new auth state with previously state', () => {
    const accountId = 'some account id';
    const idToken = undefined;
    const testInstance = getTestInstance();
    const { setAuthState } = testInstance.findByType(StubComponent).props.auth;

    setAuthState({ accountId, idToken });
    expect(testInstance.findByType(StubComponent).props.auth.isAuthorized).toBe(false);
  });
});
