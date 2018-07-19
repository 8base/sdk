// @flow

import React from 'react';
import * as R from 'ramda';

const { Provider, Consumer } = React.createContext({ isAuthorized: false });

type AuthState = {
  accountId: string,
  idToken: string,
};

type AuthProviderWrapperProps = {
  children: React$Node,
} & AuthState;

const checkIsEmptyOrNil: (any) => boolean = R.either(R.isNil, R.isEmpty);

const checkIsAuthorized = ({ accountId, idToken }: AuthState): boolean =>
  R.not(
    R.or(
      checkIsEmptyOrNil(accountId),
      checkIsEmptyOrNil(idToken),
    ),
  );

const AuthProviderWrapper = ({ accountId, idToken, children }: AuthProviderWrapperProps) => (
  <Provider value={{ isAuthorized: checkIsAuthorized({ accountId, idToken }) }}>
    { children }
  </Provider>
);

export const AuthContext = {
  Provider: AuthProviderWrapper,
  Consumer,
};
