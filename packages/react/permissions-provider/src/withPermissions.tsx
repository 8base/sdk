import React from 'react';
import { Subtract } from 'utility-types';
import { getDisplayName } from '@8base-react/utils';

import { PermissionsContext } from './PermissionsContext';
import { TransformedPermissions } from './types';

export type WithPermissionsProps = {
  permissions: TransformedPermissions;
};

const withPermissions = <T extends WithPermissionsProps>(WrappedComponent: React.ComponentType<T>) =>
  class WithPermissions extends React.Component<Subtract<T, WithPermissionsProps>> {
    public static displayName = `withPermissions(${getDisplayName<T>(WrappedComponent)})`;

    public render() {
      return (
        <PermissionsContext.Consumer>
          {({ permissions }) => <WrappedComponent {...(this.props as T)} permissions={permissions} />}
        </PermissionsContext.Consumer>
      );
    }
  };

export { withPermissions };
