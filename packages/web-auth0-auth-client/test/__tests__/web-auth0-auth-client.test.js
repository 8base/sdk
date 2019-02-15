import { WebAuth0AuthClient } from '../../src';

const ID_TOKEN = 'encoded id token';
const ANOTHER_ID_TOKEN = 'another encoded id token';
const WORKSPACE_ID = 'some workspace id';
const PROFILE_ID = 'some profile id';
const DOMAIN = 'https://test.auth0.com';
const REDIRECT_URI = 'https://test.com/auth';
const LOGOUT_REDIRECT_URI = 'https://test.com/logout';
const CLIENT_ID = 'some client id';
const EMAIL = 'test@test.com';
const DEFAULT_API_ENDPOINT = 'https://api.8base.com';
const CUSTOM_API_ENDPOINT = 'https://some-api.8base.com';

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
    redirectUri: REDIRECT_URI,
    logoutRedirectUri: LOGOUT_REDIRECT_URI,
  });

  it('As a developer, i can authorize by the client', async () => {
    await authClient.authorize({
      someProp: 'someValue',
    });

    expect(auth0.authorize).toHaveBeenCalledWith({
      someProp: 'someValue',
    });
  });

  it('As a developer, i can get authorized adata', async () => {
    auth0.parseHash.mockImplementation((callback) => {
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
      idToken: ID_TOKEN,
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

  it('As a developer, i can clear authState', async () => {
    await authClient.purgeAuthState();

    expect(await authClient.checkIsAuthorized()).toBe(false);
    expect(await authClient.getAuthState()).toEqual({});
  });

  it('As a developer, i can logout', async () => {
    await authClient.logout();

    expect(auth0.logout).toHaveBeenCalledWith({
      returnTo: LOGOUT_REDIRECT_URI,
    });
  });
});

describe('WebAuth0AuthClient with default authentication profile', () => {
  const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
  const encodedWorkspaceId = encodeURIComponent(WORKSPACE_ID);
  const encodedLogoutRedirectUri = encodeURIComponent(LOGOUT_REDIRECT_URI);

  const authClient = new WebAuth0AuthClient({
    domain: DOMAIN,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    logoutRedirectUri: LOGOUT_REDIRECT_URI,
    profile: {
      id: PROFILE_ID,
      isDefault: true,
    },
    workspaceId: WORKSPACE_ID,
  });


  it('adds 8base mediator uri to redirectUri with default api address', () => {
    const expectedRedirectUri = `${DEFAULT_API_ENDPOINT}/authRedirect?redirectUrl=${encodedRedirectUri}&workspace=${encodedWorkspaceId}`;

    expect(auth0.WebAuth).toHaveBeenCalledWith({
      domain: DOMAIN,
      clientID: CLIENT_ID,
      redirectUri: expectedRedirectUri,
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  });

  it('passes on authorize workspaceId and profileId', async () => {
    await authClient.authorize({
      someProp: 'someValue',
    });

    expect(auth0.authorize).toHaveBeenCalledWith({
      workspaceId: WORKSPACE_ID,
      profileId: PROFILE_ID,
      someProp: 'someValue',
    });
  });

  it('passes 8base mediator uri to logoutRedirectUri on logout', async () => {
    const expectedLogoutRedirectUri = `${DEFAULT_API_ENDPOINT}/authRedirect?redirectUrl=${encodedLogoutRedirectUri}&workspace=${encodedWorkspaceId}`;

    await authClient.logout();

    expect(auth0.logout).toHaveBeenCalledWith({
      returnTo: expectedLogoutRedirectUri,
    });
  });
});

describe('WebAuth0AuthClient with default authentication profile and custom api endpoint', () => {
  const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
  const encodedWorkspaceId = encodeURIComponent(WORKSPACE_ID);
  const encodedLogoutRedirectUri = encodeURIComponent(LOGOUT_REDIRECT_URI);

  const authClient = new WebAuth0AuthClient({
    domain: DOMAIN,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    logoutRedirectUri: LOGOUT_REDIRECT_URI,
    profile: {
      id: PROFILE_ID,
      isDefault: true,
    },
    workspaceId: WORKSPACE_ID,
    apiEndpoint: CUSTOM_API_ENDPOINT,
  });


  it('adds 8base mediator uri to redirectUri with default api address', () => {
    const expectedRedirectUri = `${CUSTOM_API_ENDPOINT}/authRedirect?redirectUrl=${encodedRedirectUri}&workspace=${encodedWorkspaceId}`;

    expect(auth0.WebAuth).toHaveBeenCalledWith({
      domain: DOMAIN,
      clientID: CLIENT_ID,
      redirectUri: expectedRedirectUri,
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  });

  it('passes on authorize workspaceId and profileId', async () => {
    await authClient.authorize({
      someProp: 'someValue',
    });

    expect(auth0.authorize).toHaveBeenCalledWith({
      workspaceId: WORKSPACE_ID,
      profileId: PROFILE_ID,
      someProp: 'someValue',
    });
  });

  it('passes 8base mediator uri to logoutRedirectUri on logout', async () => {
    const expectedLogoutRedirectUri = `${CUSTOM_API_ENDPOINT}/authRedirect?redirectUrl=${encodedLogoutRedirectUri}&workspace=${encodedWorkspaceId}`;

    await authClient.logout();

    expect(auth0.logout).toHaveBeenCalledWith({
      returnTo: expectedLogoutRedirectUri,
    });
  });
});

describe('WebAuth0AuthClient with custom authentication profile', () => {
  const authClient = new WebAuth0AuthClient({
    domain: DOMAIN,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    logoutRedirectUri: LOGOUT_REDIRECT_URI,
    profile: {
      id: PROFILE_ID,
      isDefault: false,
    },
    workspaceId: WORKSPACE_ID,
  });

  it('doesn\'t modify redirectUri', () => {
    expect(auth0.WebAuth).toHaveBeenCalledWith({
      domain: DOMAIN,
      clientID: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      mustAcceptTerms: true,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });
  });

  it('passes on authorize workspaceId and profileId', async () => {
    await authClient.authorize({
      someProp: 'someValue',
    });

    expect(auth0.authorize).toHaveBeenCalledWith({
      workspaceId: WORKSPACE_ID,
      profileId: PROFILE_ID,
      someProp: 'someValue',
    });
  });

  it('doesn\'t modify logoutRedirectUri', async () => {
    await authClient.logout();

    expect(auth0.logout).toHaveBeenCalledWith({
      returnTo: LOGOUT_REDIRECT_URI,
    });
  });
});

