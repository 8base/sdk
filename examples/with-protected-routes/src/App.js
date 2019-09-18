import React from 'react';
import { AppProvider } from '@8base/react-sdk';
import { BrowserRouter } from 'react-router-dom';

import { Routes } from './routes';
import { authClient } from './authClient';

const API_ENDPOINT_URI = 'https://api.8base.com/cjxotvdpv006501l68k94dz80';

const renderAppContent = ({ loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

const App = () => (
  <AppProvider uri={ API_ENDPOINT_URI } authClient={ authClient } withSubscriptions>
    {renderAppContent}
  </AppProvider>
);

export { App };
