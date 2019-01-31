import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';

import { withAuth } from './withAuth';

const withLogout = compose(
  withApollo,
  withAuth,
  withHandlers({
    logout: ({ auth: { purgeAuthState }, client }) => async () => {
      await purgeAuthState();

      client.resetStore();
    },
  }),
);

export { withLogout };

