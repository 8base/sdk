import React from 'react';
import renderer from 'react-test-renderer';

import {
  IfAllowed,
  PermissionsProvider,
  isAllowed,
  PermissionContext,
  withPermissions
} from '../../src';

const mockPermissionsData = {
  user: {
    permissions: {
      items: [
        {
          resource: 'Users',
          resourceType: 'data',
          permission: {
            create: {
              allow: true,
            },
            delete: {
              allow: true,
            },
            read: {
              allow: true,
              fields: {
                createdAt: true,
                updatedAt: true,
                email: true,
                isOwner: true,
                firstName: true,
                lastName: true,
                cellPhone: true,
                workPhone: true,
                workPhoneExt: true,
                gender: true,
                birthday: true,
                language: true,
                timezone: true,
              },
            },
            update: {
              allow: true,
              fields: {
                createdAt: true,
                updatedAt: true,
                email: false,
                isOwner: true,
                firstName: true,
                lastName: true,
                cellPhone: true,
                workPhone: true,
                workPhoneExt: true,
                gender: true,
                birthday: true,
                language: true,
                timezone: true,
              },
            },
          },
        },
        {
          resource: 'schema',
          resourceType: 'custom',
          permission: {
            edit: {
              allow: false,
            },
          },
        },
      ],
    },
  },
};

jest.mock('@8base/auth', () => ({
  withAuth: Component => props => (
    <Component { ...props } auth={{ isAuthorized: true }} />
  ),
}));

jest.mock('react-apollo', () => ({
  Query: ({ children }) => children({ data: mockPermissionsData, loading: false }),
}));

it('As a developer, I can use `IfAllowed` component for conditional rendering based user permissions.', () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed resource="Users" type="data" permission="create">
      Allowed
    </IfAllowed>
  ));

  const tree = renderer.create(
    <PermissionsProvider name="tableName">{ testRenderFn }</PermissionsProvider>,
  );

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed"');
});

it('As a developer, I can use `IfAllowed` component for pass permission check result via render props.', () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed resource="Users" type="data" permission="create">
      { allowed => `Allowed = ${allowed}` }
    </IfAllowed>
  ));

  const tree = renderer.create(
    <PermissionsProvider name="tableName">{ testRenderFn }</PermissionsProvider>,
  );

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true"');
});

it('As a developer, I can use `IfAllowed` in order to check fields permissions if allowed.', () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed resource="Users" type="data" permission="update">
      { (allowed, fields) => `Allowed = ${allowed}, allowed to change email = ${fields['email']}` }
    </IfAllowed>
  ));

  const tree = renderer.create(
    <PermissionsProvider name="tableName">{ testRenderFn }</PermissionsProvider>,
  );

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true, allowed to change email = false"');
});

// TODO this.context is an empty object so the test passes incorrectly
it('As a developer, I can use `isAllowed` for check access via context.', () => {
  class TestComponent extends React.Component {
    static contextType = PermissionContext;

    render() {
      const allowed = isAllowed(
        {
          resource: 'schema',
          type: 'custom',
          permission: 'edit',
        },
        this.context,
      );

      return `Allowed = ${allowed}`;
    }
  }

  const tree = renderer.create(
    <PermissionsProvider name="tableName">
      { () => <TestComponent /> }
    </PermissionsProvider>,
  );

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = false"');
});

it('As a developer, I can use `isAllowed` for check field access via context.', () => {
  const TestComponent = ({ permissions }) => {
    const allowed = isAllowed(
      {
        resource: 'Users',
        type: 'data',
        permission: 'update',
        field: 'firstName',
      },
      permissions,
    );

    return `Allowed = ${allowed}`;
  }

  const TestComponentWrapper = withPermissions(TestComponent);

  const tree = renderer.create(
    <PermissionsProvider>
      { () => <TestComponentWrapper /> }
    </PermissionsProvider>,
  );

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true"');
});