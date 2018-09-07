import React from 'react';
import styled from 'react-emotion';
import { Grid } from '@8base/boost';

const AppFlowContentTag = styled(Grid.Box)({
  padding: '0 2rem 2rem 2rem',
  minHeight: 0,
});

const AppFlowContent = ({ children }) => (
  <AppFlowContentTag area="content">
    { children }
  </AppFlowContentTag>
);

export { AppFlowContent };
