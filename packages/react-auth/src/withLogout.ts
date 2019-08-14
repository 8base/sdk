import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';

import { withAuth } from './withAuth';

const withLogout = compose(
  withApollo,
  withAuth,
  withHandlers<any, any>({
    logout: ({ auth: { purgeAuthState }, client }: any) => async (options?: object) => {
      await client.clearStore();

      await purgeAuthState({
        withLogout: true,
        logoutOptions: options,
      });
    },
  }),
);

export { withLogout };
