import React from 'react';
import * as renderer from 'react-test-renderer';

import { PermissionsProvider, IfAllowedRoles } from '../../src';

const mockPermissionsData = {
  teamMember: {
    roles: {
      items: [
        {
          id: '1',
          name: 'Admin',
        },
        {
          id: '2',
          name: 'Support',
        },
      ],
    },
  },
};

jest.mock('@8base-react/auth', () => ({
  withAuth: (Component: any) => (props: any) => (
    <Component {...props} auth={{ isAuthorized: true, authState: { workspaceId: 'some-workspace-id' } }} />
  ),
}));

jest.mock('@apollo/client/react/components', () => ({
  Query: ({ children }: any) => children({ data: mockPermissionsData, loading: false }),
}));

it('As a developer, I can use `IfAllowedRoles` component for conditional rendering based roles.', () => {
  const tree = renderer.create(
    <PermissionsProvider>
      {() => (
        <React.Fragment>
          <IfAllowedRoles roles={['Admin']}>Allowed</IfAllowedRoles>
          <IfAllowedRoles roles={['Other role']}>Not Allowed</IfAllowedRoles>
          <IfAllowedRoles roles={['Admin', 'Other role']}>Allowed</IfAllowedRoles>
        </React.Fragment>
      )}
    </PermissionsProvider>,
  );

  expect(tree.toJSON()).toEqual(['Allowed', 'Allowed']);
});
