import * as React from 'react';
import * as R from 'ramda';

import { PermissionsContext } from './PermissionsContext';
import { isAllowed } from './isAllowed';
import { TransformedPermissions } from './types';

type IfAllowedProps = {
  permissions: Array<Array<string>>,
  children: React.ReactNode,
};

class IfAllowed extends React.Component<IfAllowedProps> {
  renderContent = (userPermissions: TransformedPermissions) => {
    const { children, permissions } = this.props;

    const result = permissions.map(([type, resource, permission]) => ({
      allowed: isAllowed({
        type,
        resource,
        permission,
      }, userPermissions),
      fields: R.pathOr(
        {},
        [type, resource, 'permission', permission, 'fields'],
        userPermissions,
      ),
    }));

    const allowed = R.all(R.propEq('allowed', true), result);

    if (typeof children === 'function') {
      return children(allowed, result);
    }

    return allowed ? children : null;
  }

  render() {
    return (
      <PermissionsContext.Consumer>
        { this.renderContent }
      </PermissionsContext.Consumer>
    );
  }
}

export { IfAllowed };
