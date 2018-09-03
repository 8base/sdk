import { compose, withHandlers } from 'recompose';
import { withApollo } from 'react-apollo';
import { withAuth } from '@8base/auth-provider';

const withLogOut = compose(
  withApollo,
  withAuth,
  withHandlers({
    logOut: ({ auth: { setAuthState }, client }) => () => {

      setAuthState({
        accountId: '',
        email: '',
        userId: '',
        organizationId: '',
        idToken: '',
        refreshToken: '',
      });

      client.resetStore();
    },
  }),
);

export { withLogOut };
