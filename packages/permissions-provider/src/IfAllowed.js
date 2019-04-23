// @flow
import React from 'react';
import * as R from 'ramda';

import { PermissionsContext } from './PermissionsContext';
import { isAllowed } from './isAllowed';

type IfAllowedProps = {
  resource: string,
  type: string,
  permission: string,
  children: React$Node,
};

class IfAllowed extends React.Component<IfAllowedProps> {
  renderContent = (permissions: ?Object) => {
    const { children, resource, type, permission } = this.props;

    const allowed = isAllowed({
      type,
      resource,
      permission,
    }, permissions);

    const fieldsPermissions = R.pathOr(
      {},
      [type, resource, 'permission', permission, 'fields'],
      permissions,
    );

    if (typeof children === 'function') {
      return children(allowed, fieldsPermissions);
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
