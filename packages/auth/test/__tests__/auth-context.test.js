// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AuthContext, AuthProvider } from '../../src';

const TOKEN = 'some token';

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
  auth: {
    isAuthorized: boolean,
    setAuthState: Function,
    authState: Object,
  },
};

const NotAuthorizedComponent = () => 'I am not authorider';

const AuthorizedComponent = () => 'I am authorized';

const StubComponent = ({ auth: { isAuthorized }}: StubComponentProps) => {
  return isAuthorized ? (
    <AuthorizedComponent />
  ) : (
    <NotAuthorizedComponent />
  );
};

describe('AuthContext', () => {
  const authClient = new SampleAuthClient();
  const testRenderer = TestRenderer.create(
    <AuthProvider authClient={ authClient }>
      <AuthContext.Consumer>
        {
          (auth: any) => (
            <StubComponent auth={ auth } />
          )
        }
      </AuthContext.Consumer>
    </AuthProvider>,
  );
  const testInstance = testRenderer.root;

  it('As a developer, i can use AuthContext to check authorization state #1', async () => {
    const { children, props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(false);
    expect(props.auth.authState).toEqual({});
    expect(children[0].type).toBe(NotAuthorizedComponent);
  });

  it('As a developer, i can use AuthContext to update authorization state', async () => {
    const { props } = testInstance.findByType(StubComponent);

    await props.auth.setAuthState({
      token: TOKEN,
    });

    expect(authClient.setAuthState).toHaveBeenCalled();
  });

  it('As a developer, i can use AuthContext to check authorization state #2', async () => {
    const { children, props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(true);
    expect(props.auth.authState).toEqual({
      token: TOKEN,
    });
    expect(children[0].type).toBe(AuthorizedComponent);
  });

  it('As a developer, i can use AuthContext to clear authorization state', async () => {
    const { props } = testInstance.findByType(StubComponent);

    await props.auth.purgeAuthState();

    expect(authClient.purgeAuthState).toHaveBeenCalled();
  });

  it('As a developer, i can use AuthContext to check authorization state #3', async () => {
    const { children, props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(false);
    expect(props.auth.authState).toEqual({});
    expect(children[0].type).toBe(NotAuthorizedComponent);
  });
});

