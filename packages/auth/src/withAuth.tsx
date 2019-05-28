// @flow

import React from 'react';
import { wrapDisplayName } from 'recompose';

import { AuthContext, type AuthContextProps } from './AuthContext';

export type AuthProps = {
  auth: AuthContextProps,
};

const withAuth = <InputProps: { auth: AuthContextProps }>(
  WrappedComponent: React$ComponentType<InputProps>,
): Class<React$Component<$Diff<InputProps, AuthProps>>> => {
  class WithAuth extends React.Component<$Diff<InputProps, AuthProps>> {
    render() {
      return (
        <AuthContext.Consumer>
          { (auth) => (
            <WrappedComponent
              { ...this.props }
              auth={ auth }
            />
          ) }
        </AuthContext.Consumer>
      );
    }
  }

  WithAuth.displayName = wrapDisplayName(WrappedComponent, 'withAuth');

  return WithAuth;
};

export { withAuth };

