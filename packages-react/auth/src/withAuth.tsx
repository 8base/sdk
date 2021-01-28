import React from 'react';
import { Subtract } from 'utility-types';
import { getDisplayName } from '@8base-react/utils';

import { AuthContext, AuthContextProps } from './AuthContext';

export type WithAuthProps = {
  auth: AuthContextProps;
};

const withAuth = <T extends WithAuthProps>(WrappedComponent: React.ComponentType<T>) =>
  class WithAuth extends React.Component<Subtract<T, WithAuthProps>> {
    public static displayName = `withAuth(${getDisplayName<T>(WrappedComponent)})`;

    public render() {
      return (
        <AuthContext.Consumer>
          {auth => <WrappedComponent {...(this.props as T)} auth={auth || {}} />}
        </AuthContext.Consumer>
      );
    }
  };

export { withAuth };
