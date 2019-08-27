import React, { useContext } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { AuthContext } from '@8base/react-sdk';
import { withApollo } from 'react-apollo';

import { ProtectedRoute } from '../ProtectedRoute';
import { Auth } from './auth';
import { Public } from './public';
import { Protected } from './protected';

let Routes = ({ client }) => {
  const { isAuthorized, authClient } = useContext(AuthContext);

  const logout = async () => {
    await client.clearStore();

    authClient.logout();
  };

  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route>
        <Link to="/public">Public</Link>
        { isAuthorized && <Link to="/protected">Protected</Link> }
        {
          isAuthorized
          ?
          <button type="button" onClick={() => logout()}>Logout</button>
          :
          <button type="button" onClick={() => authClient.authorize()}>Login</button>
        }
        <Switch>
          <Route path="/public" component={Public} />
          <ProtectedRoute path="/protected" component={Protected} />
          <Redirect to="/public" />
        </Switch>
      </Route>
    </Switch>
  );
};

Routes = withApollo(Routes);

export { Routes };
