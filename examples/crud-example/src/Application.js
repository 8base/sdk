import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EightBaseAppProvider } from '@8base/app-provider';
import { EightBaseBoostProvider, Loader } from '@8base/boost';

import { Routes } from './routes';

const Application = () => (
  <BrowserRouter>
    <EightBaseBoostProvider>
      <EightBaseAppProvider uri={ process.env.REACT_APP_8BASE_API_URL }>
        {
          ({ loading }) => loading ? <Loader /> : <Routes />
        }
      </EightBaseAppProvider>
    </EightBaseBoostProvider>
  </BrowserRouter>
);

export { Application };
