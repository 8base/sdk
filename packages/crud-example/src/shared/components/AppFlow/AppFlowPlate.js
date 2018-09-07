import React from 'react';
import { Grid } from '@8base/boost';
import { css } from 'emotion';

import { AppFlowHeader } from './AppFlowHeader';
import { AppFlowBreadcrumbs } from './AppFlowBreadcrumbs';

const appFlowPlateClassName = css`
  background-color: #F4F5F6;
  height: 100vh;
  flex: 1;
`;

const AppFlowPlate = ({ children }) => (
  <Grid.Layout
    className={ appFlowPlateClassName }
    columns="60px 1fr"
    rows="60px 60px 1fr"
    areas={ [
      ['header', 'header'],
      ['nav', 'breadcrumbs'],
      ['nav', 'content'],
    ] }
    stretch
  >
    <AppFlowHeader />
    <AppFlowBreadcrumbs />
    { children }
  </Grid.Layout>
);

export { AppFlowPlate };
