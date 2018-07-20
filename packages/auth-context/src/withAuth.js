// @flow

import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AuthContext, type AuthContextProps } from './AuthContext';

export const withAuth = <InputProps: {}>(
  WrappedComponent: React$ComponentType<AuthContextProps & InputProps>,
): React$ComponentType<$Diff<InputProps, AuthContextProps>> => {
  class WithAuth extends React.Component<$Diff<InputProps, AuthContextProps>> {
    render() {
      return (
        <AuthContext.Consumer>
          {
            (auth: AuthContextProps) => (
              <WrappedComponent { ...this.props } { ...auth } />
            )
          }
        </AuthContext.Consumer>
      );
    }
  }
  const wrappedDisplayName: string = wrapDisplayName(WrappedComponent, 'withAuth');

  return setDisplayName(wrappedDisplayName)(WithAuth);
};
