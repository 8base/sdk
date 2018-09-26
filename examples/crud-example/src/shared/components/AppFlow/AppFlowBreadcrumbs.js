import React from 'react';
import styled from 'react-emotion';
import { matchPath } from 'react-router';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import { Grid, Breadcrumbs, Link } from '@8base/boost';

const BREADCRUMBS_ROUTES = [{
  path: '/brokers',
  component: () => 'Brokers',
  matchOptions: { exact: true },
}, {
  path: '/customers',
  component: () => 'Customers',
  matchOptions: { exact: true },
}, {
  path: '/properties',
  component: () => 'Properties',
  matchOptions: { exact: true },
}, {
  path: '/listings',
  component: () => 'Listings',
  matchOptions: { exact: true },
}];

const AppFlowHeaderTag = styled(Grid.Box)({
  paddingLeft: '2rem',
});

const AppFlowBreadcrumbsItemLink = (props) => <Link tagName={ RouterLink } color="DARK_GRAY1" size="lg" { ...props } />;

let AppFlowBreadcrumbs = ({ location }) => (
  <AppFlowHeaderTag area="breadcrumbs" justifyContent="center">
    <Breadcrumbs
      pathname={ location.pathname }
      routes={ BREADCRUMBS_ROUTES }
      matchPath={ matchPath }
      itemTagName={ AppFlowBreadcrumbsItemLink }
    />
  </AppFlowHeaderTag>
);

AppFlowBreadcrumbs = withRouter(AppFlowBreadcrumbs);

export { AppFlowBreadcrumbs };
