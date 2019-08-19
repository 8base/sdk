import { WebAuth0AuthClient } from '../../src';

const ID_TOKEN = 'encoded id token';
const ANOTHER_ID_TOKEN = 'another encoded id token';
const DOMAIN = 'https://test.auth0.com';
const REDIRECT_URI = 'https://test.com/auth';
const LOGOUT_REDIRECT_URI = 'https://test.com/logout';
const CLIENT_ID = 'some client id';
const EMAIL = 'test@test.com';
const WORKSPACE_ID = 'some workspace id';

jest.mock('auth0-js', () => {
  const authorize = jest.fn();
  const parseHash = jest.fn();
  const logout = jest.fn();
  const checkSession = jest.fn();
  const WebAuth = jest.fn(function WebAuth() {
    // @ts-ignore
    this.authorize = authorize;
    // @ts-ignore
    this.parseHash = parseHash;
    // @ts-ignore
    this.logout = logout;
    // @ts-ignore
    this.checkSession = checkSession;
  });

  return {
    WebAuth,
    authorize,
    checkSession,
    logout,
    parseHash,
  };
});

const auth0 = require('auth0-js'); // tslint:disable-line

describe('WebAuth0AuthClient', () => {
  const authClient = new WebAuth0AuthClient(
    {
      clientId: CLIENT_ID,
      domain: DOMAIN,
      redirectUri: REDIRECT_URI,
    },
    LOGOUT_REDIRECT_URI,
  );

  it('As a developer, I can authorize by the client', () => {
    authClient.authorize({
      someProp: 'someValue',
    });

    expect(auth0.authorize).toHaveBeenCalledWith({
      someProp: 'someValue',
    });
  });

  it('As a developer, I can get authorized data', async () => {
    auth0.parseHash.mockImplementation((callback: any) => {
      callback(null, {
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
      email: EMAIL,
      idToken: ID_TOKEN,
      idTokenPayload: {
        email: EMAIL,
        email_verified: true,
        someProp: 'someValue',
      },
      isEmailVerified: true,
    });
  });

  it('As a developer, I can set state', () => {
    authClient.setState({
      token: ID_TOKEN,
    });

    expect(JSON.parse(localStorage.getItem('auth') || '')).toEqual({
      token: ID_TOKEN,
    });
  });

  it('As a developer, I can get state', () => {
    const authState = authClient.getState();

    expect(authState).toEqual({
      token: ID_TOKEN,
    });
  });

  it('As a developer, I can check authorized state', () => {
    const isAuthorized = authClient.checkIsAuthorized();

    expect(isAuthorized).toBe(true);
  });

  it('As a developer, I can rewrite state', () => {
    authClient.setState({
      token: ANOTHER_ID_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    const authState = authClient.getState();

    expect(authState).toEqual({
      token: ANOTHER_ID_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, I can check session', async () => {
    auth0.checkSession.mockImplementation((options: any, callback: any) => {
      callback(null, {
        email: EMAIL,
        idToken: ANOTHER_ID_TOKEN,
        idTokenPayload: {
          email: EMAIL,
          email_verified: true,
          someProp: 'someValue',
        },
        isEmailVerified: true,
      });
    });

    const authData = await authClient.checkSession();

    expect(authData).toEqual({
      email: EMAIL,
      idToken: ANOTHER_ID_TOKEN,
      idTokenPayload: {
        email: EMAIL,
        email_verified: true,
        someProp: 'someValue',
      },
      isEmailVerified: true,
    });
  });

  it('As a developer, I can clear state', () => {
    authClient.purgeState();

    expect(authClient.checkIsAuthorized()).toBe(false);
    expect(authClient.getState()).toEqual({});
  });

  it('As a developer, I can logout', async () => {
    authClient.logout();

    expect(auth0.logout).toHaveBeenCalledWith({
      returnTo: LOGOUT_REDIRECT_URI,
    });
  });
});
