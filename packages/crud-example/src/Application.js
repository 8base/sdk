import React from 'react';

import { Providers } from 'shared/providers';
import { Routes } from './routes';

const Application = () => (
  <Providers>
    <Routes />
  </Providers>
);

export { Application };
