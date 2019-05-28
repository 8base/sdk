import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';

import { withAuth } from './withAuth';

const withLogout = compose(
  withApollo,
  withAuth,
  withHandlers({
    logout: ({
      auth: {
        purgeAuthState,
        logout,
      },
      client,
    }) => async (options) => {
      await purgeAuthState();

      client.resetStore();

      if (typeof logout === 'function') {
        await logout(options);
      }
    },
  }),
);

export { withLogout };

