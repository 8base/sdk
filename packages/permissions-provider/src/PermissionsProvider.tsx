import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withAuth, WithAuthProps } from '@8base/auth';

import { PermissionsContext } from './PermissionsContext';
import { getPermissions } from './getPermissions';
import { RequestPermissions } from './types';

const USER_PERMISSIONS_QUERY = gql`
  query UserPermissions {
    user {
      permissions {
        items {
          resource
          resourceType
          permission
        }
      }
    }
  }
`;

type PermissionsProviderProps = {
  children: (renderProp: { loading?: boolean }) => React.ReactNode;
  notifyOnNetworkStatusChange?: boolean;
};

/**
 * Provider for 8base user permissions
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
const PermissionsProvider: React.ComponentType<PermissionsProviderProps> = withAuth(
  class PermissionsProvider extends React.Component<WithAuthProps & PermissionsProviderProps> {
    public renderContent = ({ data, loading }: { data: RequestPermissions; loading: boolean }) => {
      const { children } = this.props;

      if (loading) {
        return children({ loading });
      }

      const permissions = getPermissions(data);

      return <PermissionsContext.Provider value={permissions}>{children({ loading })}</PermissionsContext.Provider>;
    };

    public render() {
      const {
        auth: { isAuthorized },
        notifyOnNetworkStatusChange,
        children,
      } = this.props;

      let rendered = null;

      if (isAuthorized) {
        rendered = (
          <Query query={USER_PERMISSIONS_QUERY} notifyOnNetworkStatusChange={notifyOnNetworkStatusChange}>
            {this.renderContent}
          </Query>
        );
      } else {
        rendered = children({});
      }

      return rendered;
    }
  },
);

export { PermissionsProvider };
