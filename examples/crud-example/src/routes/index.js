import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AppFlow, ProtectedRoute } from 'shared/components';
import { LogIn } from './log-in';
import { Brokers } from './brokers';
import { Customers } from './customers';
import { Properties } from './properties';
import { Listings } from './listings';

const Routes = () => (
  <Switch>
    <Route path="/log-in" component={ LogIn } />
    <Route>
      <AppFlow.Plate>
        <AppFlow.Nav.Plate color="BLUE">
          <AppFlow.Nav.Item icon="Group" to="/brokers" label="Brokers" />
          <AppFlow.Nav.Item icon="Customers" to="/customers" label="Customers" />
          <AppFlow.Nav.Item icon="House" to="/properties" label="Properties" />
          <AppFlow.Nav.Item icon="Contract" to="/listings" label="Listings" />
        </AppFlow.Nav.Plate>
        <AppFlow.Content>
          <Switch>
            <ProtectedRoute exact path="/brokers" component={ Brokers } />
            <ProtectedRoute exact path="/customers" component={ Customers } />
            <ProtectedRoute exact path="/properties" component={ Properties } />
            <ProtectedRoute exact path="/listings" component={ Listings } />
            <Redirect to="/brokers" />
          </Switch>
        </AppFlow.Content>
      </AppFlow.Plate>
    </Route>
  </Switch>
);

export { Routes };
