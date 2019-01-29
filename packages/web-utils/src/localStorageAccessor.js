// @flow
import type { AuthState } from '@8base/utils';

const AUTH_LOCALSTORAGE_KEY = 'auth';

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

const purgeAuthState = () => {
  localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);
};

export {
  getAuthState,
  setAuthState,
  purgeAuthState,
};

