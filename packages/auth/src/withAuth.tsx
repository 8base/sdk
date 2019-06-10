import React from 'react';
import { Subtract } from 'utility-types';
import { wrapDisplayName } from 'recompose';

import { AuthContext, AuthContextProps } from './AuthContext';

export type WithAuthProps = {
  auth: AuthContextProps;
};

const withAuth = <T extends WithAuthProps>(WrappedComponent: React.ComponentType<T>) =>
  class WithAuth extends React.Component<Subtract<T, WithAuthProps>> {
    public static displayName = wrapDisplayName(WrappedComponent, 'withAuth');

    public render() {
      return (
        <AuthContext.Consumer>
          {auth => <WrappedComponent {...(this.props as T)} auth={auth || {}} />}
        </AuthContext.Consumer>
      );
    }
  };

export { withAuth };
