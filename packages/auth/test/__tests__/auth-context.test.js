// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AuthProvider, AuthConsumer, AuthZeroWebClient } from '../../src';

jest.mock('auth0-js', () => {
  const authorize = jest.fn();
  const parseHash = jest.fn();
  const logout = jest.fn();
  const checkSession = jest.fn();
  const WebAuth = jest.fn(function WebAuth() {
    this.authorize = authorize;
    this.parseHash = parseHash;
    this.logout = logout;
    this.checkSession = checkSession;
  });

  return {
    authorize,
    parseHash,
    logout,
    checkSession,
    WebAuth,
  };
});

const auth0 = require('auth0-js');

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
  const authClient = new AuthZeroWebClient({
    domain: 'domain',
    clientID: 'clientID',
    redirectUri: 'redirectUri',
  });

  const testRenderer = TestRenderer.create(
    <AuthProvider authClient={ authClient }>
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

beforeEach(() => {
  auth0.WebAuth.mockClear();
  auth0.authorize.mockClear();
  auth0.parseHash.mockClear();
  auth0.logout.mockClear();
  auth0.checkSession.mockClear();
});

describe('As a developer, i can use AuthContext to get authorization state in any place of react tree', () => {
  it('sets isAuthorized=true if there are valid workspaceId and idToken', () => {
    const workspaceId = 'some workspace id';
    const idToken = 'some id token';
    const testInstance = getTestInstance();
    const { setAuthState } = testInstance.findByType(StubComponent).props.auth;

    setAuthState({ workspaceId, idToken });
    expect(testInstance.findByType(StubComponent).props.auth.isAuthorized).toBe(true);
  });

  it('sets isAuthorized=false if there is an invalid prop', () => {
    const workspaceId = 'some workspace id';
    const idToken = undefined;
    const testInstance = getTestInstance();
    const { setAuthState } = testInstance.findByType(StubComponent).props.auth;

    setAuthState({ workspaceId, idToken });
    expect(testInstance.findByType(StubComponent).props.auth.isAuthorized).toBe(false);
  });

  it('merges new auth state with previously state', () => {
    const workspaceId = 'some workspace id';
    const idToken = undefined;
    const testInstance = getTestInstance();
    const { setAuthState } = testInstance.findByType(StubComponent).props.auth;

    setAuthState({ workspaceId, idToken });
    expect(testInstance.findByType(StubComponent).props.auth.isAuthorized).toBe(false);
  });

  it('creates auth0 instance', () => {
    getTestInstance();

    expect(auth0.WebAuth).toHaveBeenCalledWith({
      domain: 'domain',
      clientID: 'clientID',
      redirectUri: 'redirectUri',
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  });

  it('passes \'authorize\' function that calls auth0\'s authorize', () => {
    const testInstance = getTestInstance();
    const { authorize } = testInstance.findByType(StubComponent).props.auth;

    authorize();
    expect(auth0.authorize).toHaveBeenCalled();
  });

  it('passes \'getAuthorizedData\' function that calls auth0\'s getAuthorizedData and resolves promise on success', (done) => {
    const testInstance = getTestInstance();
    const { getAuthorizedData } = testInstance.findByType(StubComponent).props.auth;
    auth0.parseHash.mockImplementation((callback) => callback(null, 'hash'));

    getAuthorizedData().then(() => {
      expect(auth0.parseHash).toHaveBeenCalled();
      done();
    });
  });

  it('passes \'getAuthorizedData\' function that calls auth0\'s getAuthorizedData and rejects promise on error', (done) => {
    const testInstance = getTestInstance();
    const { getAuthorizedData } = testInstance.findByType(StubComponent).props.auth;
    auth0.parseHash.mockImplementation((callback) => callback('error'));

    getAuthorizedData().catch(() => {
      expect(auth0.parseHash).toHaveBeenCalled();
      done();
    });
  });

  it('passes \'logout\' function that calls auth0\' logout', () => {
    const testInstance = getTestInstance();
    const { logout } = testInstance.findByType(StubComponent).props.auth;

    logout();
    expect(auth0.logout).toHaveBeenCalled();
  });

  it('passes \'checkSession\' function that calls auth0\'s checkSession and resolves promise on success', (done) => {
    const testInstance = getTestInstance();
    const { checkSession } = testInstance.findByType(StubComponent).props.auth;
    auth0.checkSession.mockImplementation((options, callback) => callback(null, 'result'));

    checkSession().then(() => {
      expect(auth0.checkSession).toHaveBeenCalled();
      done();
    });
  });

  it('passes \'checkSession\' function that calls auth0\'s checkSession and rejects promise on error', (done) => {
    const testInstance = getTestInstance();
    const { checkSession } = testInstance.findByType(StubComponent).props.auth;
    auth0.checkSession.mockImplementation((options, callback) => callback('error'));

    checkSession().catch(() => {
      expect(auth0.checkSession).toHaveBeenCalled();
      done();
    });
  });
});
