import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';

import { withAuth } from './withAuth';

const withLogOut = compose(
  withApollo,
  withAuth,
  withHandlers({
    logOut: ({ auth: { purgeAuthState, logout }, client }) => () => {
      purgeAuthState();
      logout();

      client.resetStore();
    },
  }),
);

export { withLogOut };
