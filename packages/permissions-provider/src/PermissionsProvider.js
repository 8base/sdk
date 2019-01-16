// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withAuth, type AuthContextProps } from '@8base/auth';

import { PermissionsContext } from './PermissionsContext';
import { getPermissions } from './getPermissions';

const USER_PERMISSIONS_QUERY = gql`
  query UserPermissions {
    user {
      roles {
        items {
          permissions {
            items {
              resource
              resourceType
              permission
            }
          }
        }
      }
    }
  }
`;

type PermissionsProviderProps = {
  children: ({ loading?: boolean }) => React$Node,
  auth: AuthContextProps,
  notifyOnNetworkStatusChange: boolean,
};

/**
 * Provider for 8base user permissions
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
class PermissionsProvider extends React.Component<PermissionsProviderProps> {
  renderContent = ({ data, loading }) => {
    const { children } = this.props;

    if (loading) return children({ loading });

    const permissions = getPermissions(data);

    return (
      <PermissionsContext.Provider value={ permissions }>
        { children({ loading }) }
      </PermissionsContext.Provider>
    );
  };

  render() {
    const {
      auth: { isAuthorized },
      notifyOnNetworkStatusChange,
      children,
    } = this.props;

    let rendered = null;

    if (isAuthorized) {
      rendered = (
        <Query
          query={ USER_PERMISSIONS_QUERY }
          notifyOnNetworkStatusChange={ notifyOnNetworkStatusChange }
        >
          { this.renderContent }
        </Query>
      );
    } else {
      rendered = children({});
    }

    return rendered;
  }
}

PermissionsProvider = withAuth(PermissionsProvider);

export { PermissionsProvider };
