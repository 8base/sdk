import React from 'react';
import { DocumentNode } from 'graphql';
import * as R from 'ramda';
import { gql } from '@apollo/client';
// TODO: apollo Query component is deprecated
import { Query } from '@apollo/client/react/components';
import { withAuth, WithAuthProps } from '@8base-react/auth';

import { PermissionsContext } from './PermissionsContext';
import { getPermissions } from './getPermissions';
import { RequestPermissions } from './types';

const USER_PERMISSIONS_QUERY = gql`
  query UserPermissions {
    user {
      id
      permissions {
        items {
          resource
          resourceType
          permission
        }
      }
      roles {
        items {
          id
          name
        }
      }
    }
  }
`;

const TEAM_MEMBER_PERMISSIONS_QUERY = gql`
  query TeamMemberPermissions {
    teamMember {
      id
      permissions {
        items {
          resource
          resourceType
          permission
        }
      }
      roles {
        items {
          id
          name
        }
      }
    }
  }
`;

type PermissionsProviderCommonProps = {
  type?: 'teamMember' | 'user';
  customQuery?: DocumentNode;
};

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
      const { type = 'teamMember' } = this.props;

      const permissions = getPermissions(data, type);

      const roles = R.pipe(
        R.pathOr([], [type, 'roles', 'items']),
        R.map(({ name }) => name),
      )(data);

      return (
        <PermissionsContext.Provider value={{ permissions, roles }}>
          {this.renderChildren({ loading })}
        </PermissionsContext.Provider>
      );
    };

    public render() {
      const {
        auth: { isAuthorized, authState },
        children,
        type,
        customQuery,
        ...rest
      } = this.props;

      return (
        <Query
          query={customQuery || (type === 'user' ? USER_PERMISSIONS_QUERY : TEAM_MEMBER_PERMISSIONS_QUERY)}
          skip={!isAuthorized || !authState.workspaceId}
          {...rest}
        >
          {this.renderContent}
        </Query>
      );
    }
  },
);

export { PermissionsProvider };
