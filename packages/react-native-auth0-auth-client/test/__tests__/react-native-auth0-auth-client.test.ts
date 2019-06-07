import { ReactNativeAuth0AuthClient } from '../../src';

const ID_TOKEN = 'encoded id token';
const ANOTHER_ID_TOKEN = 'another encoded id token';
const WORKSPACE_ID = 'some workspace id';
const DOMAIN = 'https://test.auth0.com';
const CLIENT_ID = 'some client id';

jest.mock('expo', () => ({
  AuthSession: {
    getRedirectUrl: jest.fn(() => 'https://auth.expo.io/@vorobeez/react-native-example'),
    startAsync: jest.fn(() => Promise.resolve({
      type: 'success',
      params: {
        id_token: 'encoded id token',
      },
    })),
    dismiss: jest.fn(() => {}),
  },
}));

jest.mock('jwt-decode', () => jest.fn(
  () => ({
    another_data: 'some data',
    email: 'test@test.com',
    email_verified: true,
  }),
));

jest.mock('react-native', () => {
  const storage = {};

  return {
    AsyncStorage: {
      getItem: jest.fn((key) => Promise.resolve(storage[key] || null)),
      setItem: jest.fn((key, value) => {
        storage[key] = value;

        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        storage[key] = null;

        return Promise.resolve();
      }),
    },
  };
});

const { AuthSession } = require('expo');

describe('ReactNativeAuth0AuthClient', () => {
  const client = new ReactNativeAuth0AuthClient({
    domain: DOMAIN,
    clientId: CLIENT_ID,
  });

  it('As a developer, i can authorize by the client', async () => {
    const authData = await client.authorize({
      customParam: 'custom data',
    });

    expect(authData).toEqual({
      idToken: ID_TOKEN,
      idTokenPayload: {
        another_data: 'some data',
        email: 'test@test.com',
        email_verified: true,
      },
      email: 'test@test.com',
      isEmailVerified: true,
    });

    expect(AuthSession.startAsync).toHaveBeenCalledWith({
      authUrl: `${DOMAIN}/authorize?`
        + `${encodeURIComponent('client_id')}=${encodeURIComponent(CLIENT_ID)}&`
        + `${encodeURIComponent('response_type')}=${encodeURIComponent('id_token')}&`
        + `${encodeURIComponent('scope')}=${encodeURIComponent('openid email profile')}&`
        + `${encodeURIComponent('redirect_uri')}=${encodeURIComponent('https://auth.expo.io/@vorobeez/react-native-example')}&`
        + `${encodeURIComponent('nonce')}=${encodeURIComponent('fakenonce')}&`
        + `${encodeURIComponent('customParam')}=${encodeURIComponent('custom data')}`,
    });
  });

  it('As a developer, i can get auth state', async () => {
    expect(await client.getAuthState()).toEqual({
      token: ID_TOKEN,
    });
  });

  it('As a developer, i can rewrite auth state', async () => {
    await client.setAuthState({
      token: ANOTHER_ID_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    expect(await client.getAuthState()).toEqual({
      token: ANOTHER_ID_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, i can check authorized state', async () => {
    expect(await client.checkIsAuthorized()).toBe(true);
  });

  it('As a developer, i can logout', async () => {
    await client.purgeAuthState();

    expect(await client.checkIsAuthorized()).toBe(false);
    expect(await client.getAuthState()).toEqual({});
    expect(AuthSession.dismiss).toHaveBeenCalled();
  });
});

