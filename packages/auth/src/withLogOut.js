import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';

import { withAuth } from './withAuth';

const withLogOut = compose(
  withApollo,
  withAuth,
  withHandlers({
    logOut: ({ auth: { logout }, client }) => (options) => {
      logout(options);

      client.resetStore();
    },
  }),
);

export { withLogOut };
