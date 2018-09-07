import React from 'react';
import { Navigation } from '@8base/boost';
import { NavLink } from 'react-router-dom';

const AppFlowNavItem = (props) => (
  <Navigation.Item tagName={ NavLink } { ...props } />
);

export { AppFlowNavItem };
