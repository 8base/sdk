import React, { useContext } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { withLogout, AuthContext } from '@8base/react-sdk';

import { ProtectedRoute } from '../ProtectedRoute';
import { Auth } from './auth';
import { Public } from './public';
import { Protected } from './protected';

let Routes = ({ logout }) => {
  const { isAuthorized, authorize } = useContext(AuthContext);

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
          <button type="button" onClick={() => authorize()}>Login</button>
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

Routes = withLogout(Routes);

export { Routes };