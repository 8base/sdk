import React from 'react';
import * as renderer from 'react-test-renderer';

import { PermissionsProvider, useAllowedRoles, IfAllowedRoles } from '../../src';

const mockPermissionsData = {
  user: {
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

it('As a developer, I can use `useAllowedRoles` hook for conditional rendering based roles.', () => {
  const Test = () => {
    const adminRole = useAllowedRoles(['Admin']);
    const otherRole = useAllowedRoles(['Other role']);
    const bothRoles = useAllowedRoles(['Admin', 'Other role']);

    return <div>{`${adminRole} ${otherRole} ${bothRoles}`}</div>;
  };

  const tree = renderer.create(<PermissionsProvider type="user">{() => <Test />}</PermissionsProvider>);

  expect(tree.toJSON()).toMatchInlineSnapshot(`
    <div>
      true false true
    </div>
  `);
});
