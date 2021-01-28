import { IAuthClient, IStorage, StorageAPI, IAuthState } from '@8base/utils';

export const authState = {};

export const externalAuth = {
  login: jest.fn(() => ({ token: 'some-token' })),
  logout: jest.fn(() => ({ token: null })),
};

export const authStorage: IStorage = {
  getItem: key => Reflect.get(authState, key),
  setItem: (key, value) => {
    Reflect.set(authState, key, value);
  },
  removeItem: key => {
    Reflect.deleteProperty(authState, key);
  },
};

export const DummyAuthClient = (): IAuthClient => {
  const storageAPI = new StorageAPI<IAuthState>(authStorage, 'auth');

  const getState = jest.fn(() => {
    return storageAPI.getState();
  });

  const setState = jest.fn((newState: IAuthState) => {
    storageAPI.setState(newState);
  });

  const purgeState = jest.fn(() => {
    storageAPI.purgeState();
  });

  const checkIsAuthorized = jest.fn(() => {
    const state = getState();

    return !!state.token;
  });

  const login = jest.fn(() => {
    return externalAuth.login();
  });

  const logout = jest.fn(() => {
    return externalAuth.logout();
  });

  const getTokenInfo = jest.fn(() => {
    return {};
  });

  return {
    getTokenInfo,
    getState,
    setState,
    purgeState,
    checkIsAuthorized,
    login,
    logout,
  };
};
