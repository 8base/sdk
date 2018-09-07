import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AppFlow, ProtectedRoute } from 'shared/components';
import { LogIn } from './log-in';
import { Clients } from './clients';

const Routes = () => (
  <Switch>
    <Route path="/log-in" component={ LogIn } />
    <Route>
      <AppFlow.Plate>
        <AppFlow.Nav.Plate color="LIGHT_BLUE">
          <AppFlow.Nav.Item icon="Group" to="/clients" label="Clients" />
        </AppFlow.Nav.Plate>
        <AppFlow.Content>
          <Switch>
            <ProtectedRoute exact path="/clients" component={ Clients } />
            <Redirect to="/clients" />
          </Switch>
        </AppFlow.Content>
      </AppFlow.Plate>
    </Route>
  </Switch>
);

export { Routes };
