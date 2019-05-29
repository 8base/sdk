import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Subtract } from 'utility-types';

import { PermissionsContext } from './PermissionsContext';
import { TransformedPermissions } from './types';


export type WithPermissionsProps = {
  permissions: TransformedPermissions,
};


const withPermissions = <T extends WithPermissionsProps>(
  WrappedComponent: React.ComponentType<T>,
) => 
  class WithPermissions extends React.Component<Subtract<T, WithPermissionsProps>> {
    public static displayName = wrapDisplayName(WrappedComponent,'withPermissions');

    render() {
      return (
        <PermissionsContext.Consumer>
          { (permissions) => (
            <WrappedComponent
              { ...this.props as T }
              permissions={ permissions }
            />
          ) }
        </PermissionsContext.Consumer>
      );
    }
  }


export { withPermissions };

