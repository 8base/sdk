import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';
import { Grid } from '@8base/boost';

import { AppFlowUserContainer } from './AppFlowUser.container.js';
import logo from 'images/8base-logo-red-black.svg';

const AppFlowHeaderTag = styled(Grid.Layout)({
  height: '6rem',
  padding: '0 2rem',
  backgroundColor: '#fff',
  borderBottom: '1px solid #D0D7DD',
});

const AppFlowHeaderLogoTag = styled('img')({
  height: '3rem',
});

const AppFlowHeader = () => (
  <Grid.Box area="header">
    <AppFlowHeaderTag columns="1fr auto" gap="lg">
      <Grid.Box justifyContent="center">
        <Link to="/">
          <AppFlowHeaderLogoTag src={ logo } alt="8base logo" />
        </Link>
      </Grid.Box>
      <Grid.Box justifyContent="center">
        <AppFlowUserContainer />
      </Grid.Box>
    </AppFlowHeaderTag>
  </Grid.Box>
);

export { AppFlowHeader };
