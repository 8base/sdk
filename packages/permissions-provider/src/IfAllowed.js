// @flow
import React from 'react';

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

    if (typeof children === 'function') {
      return children(allowed);
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
