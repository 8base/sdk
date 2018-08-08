// @flow

type PossibleAuthItems = 'organizationId' | 'email' | 'id' | 'accountId' | 'refreshToken' | 'idToken';

const AUTH_LOCALSTORAGE_KEY = 'auth';

type AuthState = {
  [PossibleAuthItems]: string,
}

const getAuthState = (): AuthState => {
  const auth = JSON.parse(localStorage.getItem(AUTH_LOCALSTORAGE_KEY) || '{}');
  return auth || {};
};

const setAuthState = (newState: AuthState) => {
  const currentState = getAuthState();
  const mergedState = {
    ...currentState,
    ...newState,
  };

  localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(mergedState));
};


export {
  getAuthState,
  setAuthState,
};

export type {
  AuthState,
};

