import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withAuth, WithAuthProps } from '@8base/react-auth';

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

type PermissionsProviderCommonProps = {};

type PermissionsProviderProps =
  | ({
      children: React.ReactNode;
    } & PermissionsProviderCommonProps)
  | ({
      children: (props: { loading: boolean }) => React.ReactNode;
    } & PermissionsProviderCommonProps);

/**
 * Provider for 8base user permissions
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
const PermissionsProvider: React.ComponentType<PermissionsProviderProps> = withAuth(
  class PermissionsProvider extends React.Component<WithAuthProps & PermissionsProviderProps> {
    public renderChildren = (args: { loading: boolean }) => {
      const { children } = this.props;

      if (typeof children === 'function') {
        return children(args);
      }

      return children;
    };

    public renderContent = ({ data, loading }: { data: RequestPermissions; loading: boolean }) => {
      const { children } = this.props;

      const permissions = getPermissions(data);

      return (
        <PermissionsContext.Provider value={permissions}>
          {this.renderChildren({ loading })}
        </PermissionsContext.Provider>
      );
    };

    public render() {
      const {
        auth: { isAuthorized, authState },
        children,
        ...rest
      } = this.props;

      return (
        <Query query={USER_PERMISSIONS_QUERY} skip={!isAuthorized || !authState.workspaceId} {...rest}>
          {this.renderContent}
        </Query>
      );
    }
  },
);

export { PermissionsProvider };
