// @flow

import React from 'react';
import * as R from 'ramda';

type AuthState = {
  accountId: string,
  idToken: string,
};

type AuthProviderWrapperProps = {
  children: React$Node,
} & AuthState;

export type AuthContextProps = {
  isAuthorized: boolean | void,
};

const checkIsEmptyOrNil: (any) => boolean = R.either(R.isNil, R.isEmpty);

const checkIsAuthorized = ({ accountId, idToken }: AuthState): boolean =>
  R.not(
    R.or(
      checkIsEmptyOrNil(accountId),
      checkIsEmptyOrNil(idToken),
    ),
  );

const { Provider, Consumer } = React.createContext({ isAuthorized: false });

const AuthProviderWrapper = ({ accountId, idToken, children }: AuthProviderWrapperProps) => (
  <Provider value={{ isAuthorized: checkIsAuthorized({ accountId, idToken }) }}>
    { children }
  </Provider>
);

export const AuthContext = {
  Provider: AuthProviderWrapper,
  Consumer,
};
