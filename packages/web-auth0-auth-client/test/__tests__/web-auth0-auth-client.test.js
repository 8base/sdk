import { WebAuth0AuthClient } from '../../src';

const ID_TOKEN = 'encoded id token';
const ANOTHER_ID_TOKEN = 'another encoded id token';
const WORKSPACE_ID = 'some workspace id';
const DOMAIN = 'https://test.auth0.com';
const REDIRECT_URL = 'https://test.com/auth';
const LOGOUT_REDIRECT_URL = 'https://test.com/logout';
const CLIENT_ID = 'some client id';
const EMAIL = 'test@test.com';

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

describe('WebAuth0AuthClient', () => {
  const authClient = new WebAuth0AuthClient({
    domain: DOMAIN,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URL,
    logoutRedirectUri: LOGOUT_REDIRECT_URL,
    workspaceId: WORKSPACE_ID,
  });

  it('As a developer, i can authorize by the client', async () => {
    await authClient.authorize({
      someProp: 'someValue',
    });

    expect(auth0.authorize).toHaveBeenCalledWith({
      state: `{"workspaceId":"${WORKSPACE_ID}"}`,
      someProp: 'someValue',
    });
  });

  it('As a developer, i can get authorized adata', async () => {
    auth0.parseHash.mockImplementation((callback) => {
      callback(null, {
        state: `{"workspaceId":"${WORKSPACE_ID}"}`,
        idToken: ID_TOKEN,
        idTokenPayload: {
          email: EMAIL,
          email_verified: true,
          someProp: 'someValue',
        },
      });
    });

    const authData = await authClient.getAuthorizedData();

    expect(authData).toEqual({
      idToken: ID_TOKEN,
      state: {
        workspaceId: WORKSPACE_ID,
      },
      email: EMAIL,
      isEmailVerified: true,
      idTokenPayload: {
        email: EMAIL,
        email_verified: true,
        someProp: 'someValue',
      },
    });
  });

  it('As a developer, i can set auth state', async () => {
    await authClient.setAuthState({
      token: ID_TOKEN,
    });

    expect(JSON.parse(localStorage.getItem('auth'))).toEqual({
      token: ID_TOKEN,
    });
  });

  it('As a developer, i can get auth state', async () => {
    const authState = await authClient.getAuthState();

    expect(authState).toEqual({
      token: ID_TOKEN,
    });
  });

  it('As a developer, i can check authorized state', async () => {
    const isAuthorized = await authClient.checkIsAuthorized();

    expect(isAuthorized).toBe(true);
  });

  it('As a developer, i can rewrite auth state', async () => {
    await authClient.setAuthState({
      token: ANOTHER_ID_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    const authState = await authClient.getAuthState();

    expect(authState).toEqual({
      token: ANOTHER_ID_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, i can renew token', async () => {
    auth0.checkSession.mockImplementation((options, callback) => {
      callback(null, {
        idToken: ANOTHER_ID_TOKEN,
        state: {
          workspaceId: WORKSPACE_ID,
        },
        email: EMAIL,
        isEmailVerified: true,
        idTokenPayload: {
          email: EMAIL,
          email_verified: true,
          someProp: 'someValue',
        },
      });
    });

    const authData = await authClient.renewToken();

    expect(authData).toEqual({
      state: {
        workspaceId: WORKSPACE_ID,
      },
      email: EMAIL,
      idToken: ANOTHER_ID_TOKEN,
      isEmailVerified: true,
      idTokenPayload: {
        email: EMAIL,
        email_verified: true,
        someProp: 'someValue',
      },
    });
  });

  it('As a developer, i can logout', async () => {
    await authClient.purgeAuthState();

    expect(await authClient.checkIsAuthorized()).toBe(false);
    expect(await authClient.getAuthState()).toEqual({});
    expect(auth0.logout).toHaveBeenCalledWith({
      returnTo: LOGOUT_REDIRECT_URL,
    });
  });
});

