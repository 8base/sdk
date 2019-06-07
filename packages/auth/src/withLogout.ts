import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';

import { withAuth } from './withAuth';

const withLogout = compose(
  withApollo,
  withAuth,
  withHandlers<any, any>({
    logout: ({ auth: { purgeAuthState, logout }, client }: any) => async (options: any) => {
      await purgeAuthState();

      client.resetStore();

      if (typeof logout === 'function') {
        await logout(options);
      }
    },
  }),
);

export { withLogout };
