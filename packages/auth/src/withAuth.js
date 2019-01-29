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

    static contextType: typeof AuthContext;

    render() {
      return (
        <WrappedComponent
          { ...this.props }
          auth={ this.context }
        />
      );
    }
  }

  WithAuth.contextType = AuthContext;
  WithAuth.displayName = wrapDisplayName(WrappedComponent, 'withAuth');

  return WithAuth;
};

export { withAuth };

