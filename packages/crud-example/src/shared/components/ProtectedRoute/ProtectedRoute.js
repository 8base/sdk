import React from 'react';
import * as R from 'ramda';
import { Route, Redirect } from 'react-router';
import { withAuth } from '@8base/auth-provider';

import { renderComponent } from 'shared/utils';

class ProtectedRoute extends React.Component {
  renderRoute = () => {
    const { auth: { isAuthorized }, ...rest } = this.props;

    if (isAuthorized) {
      return renderComponent(rest);
    }

    return <Redirect to={{ pathname: '/log-in', state: { from: rest.location }}} />;
  };

  render() {
    const props = R.omit(['component', 'render'], this.props);

    return <Route { ...props } render={ this.renderRoute } />;
  }
}

ProtectedRoute = withAuth(ProtectedRoute);

export { ProtectedRoute };