// @flow

import React from 'react';
import { wrapDisplayName } from 'recompose';

import { PermissionsContext } from './PermissionsContext';

export type PermissionsProps = {
  permissions: ?Object,
};

const withPermissions = <InputPorps: { permissions: ?Object }>(
  WrappedComponent: React$ComponentType<InputPorps>,
): Class<React$Component<$Diff<InputPorps, PermissionsProps>>> => {
  class WithPermissions extends React.Component<$Diff<InputPorps, PermissionsProps>> {
    render() {
      return (
        <PermissionsContext.Consumer>
          { (permissions) => (
            <WrappedComponent
              { ...this.props }
              permissions={ permissions }
            />
          ) }
        </PermissionsContext.Consumer>
      );
    }
  }

  WithPermissions.displayName = wrapDisplayName(
    WrappedComponent,
    'withPermissions',
  );

  return WithPermissions;
};

export { withPermissions };

