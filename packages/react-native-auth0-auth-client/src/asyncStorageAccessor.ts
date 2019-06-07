// @flow

import { AsyncStorage } from 'react-native';
import type { AuthState } from '@8base/utils';

const AUTH_ASYNCSTORAGE_KEY = 'auth';

const getAuthState = async (): Promise<AuthState> => {
  const auth = JSON.parse(
    await AsyncStorage.getItem(AUTH_ASYNCSTORAGE_KEY),
  );

  return auth || {};
};

const setAuthState = async (newState: AuthState): Promise<void> => {
  const currentState = await getAuthState();
  const mergedState = {
    ...currentState,
    ...newState,
  };

  await AsyncStorage.setItem(
    AUTH_ASYNCSTORAGE_KEY,
    JSON.stringify(mergedState),
  );
};

const purgeAuthState = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_ASYNCSTORAGE_KEY);
};

export {
  getAuthState,
  setAuthState,
  purgeAuthState,
};

