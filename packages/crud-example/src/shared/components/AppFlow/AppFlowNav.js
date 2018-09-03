import React from 'react';
import styled from 'react-emotion';
import { Grid, Navigation } from '@8base/boost';

const AppFlowNavTag = styled(Navigation.Plate)((props) => ({
  position: 'fixed',
  left: 0,
  zIndex: props.theme.Z_INDEX.FIXED_NAV,
}));

const AppFlowNav = ({ children, ...rest }) => (
  <Grid.Box area="nav">
    <AppFlowNavTag { ...rest } >
      { children }
    </AppFlowNavTag>
  </Grid.Box>
);

export { AppFlowNav };
