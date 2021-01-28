import React from 'react';
import * as renderer from 'react-test-renderer';

import {
  IfAllowed,
  PermissionsProvider,
  isAllowed,
  withPermissions,
  usePermissions,
} from '../../src';

const mockPermissionsData = {
  teamMember: {
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

jest.mock('@8base-react/auth', () => ({
  withAuth: (Component: any) => (props: any) => (
    <Component {...props} auth={{ isAuthorized: true, authState: { workspaceId: 'some-workspace-id' } }} />
  ),
}));

jest.mock('@apollo/client/react/components', () => ({
  Query: ({ children }: any) => children({ data: mockPermissionsData, loading: false }),
}));

it('As a developer, I can use `IfAllowed` component for conditional rendering based user permissions.', () => {
  const testRenderFn = jest.fn(() => <IfAllowed permissions={[['data', 'Users', 'create']]}>Allowed</IfAllowed>);

  const tree = renderer.create(<PermissionsProvider>{testRenderFn}</PermissionsProvider>);

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed"');
});

it('As a developer, I can use `IfAllowed` component for conditional rendering based multiple user permissions.', () => {
  const testContentRenderFn = jest.fn(() => null);

  const testRenderFn = jest.fn(() => (
    <IfAllowed permissions={[['data', 'Users', 'create'], ['data', 'Users', 'update']]}>
      {testContentRenderFn}
    </IfAllowed>
  ));

  const tree = renderer.create(<PermissionsProvider>{testRenderFn}</PermissionsProvider>);

  expect(tree.toJSON()).toEqual(null);
  expect(testContentRenderFn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        true,
        Array [
          Object {
            "allowed": true,
            "fields": Object {},
          },
          Object {
            "allowed": true,
            "fields": Object {
              "birthday": true,
              "cellPhone": true,
              "createdAt": true,
              "email": false,
              "firstName": true,
              "gender": true,
              "isOwner": true,
              "language": true,
              "lastName": true,
              "timezone": true,
              "updatedAt": true,
              "workPhone": true,
              "workPhoneExt": true,
            },
          },
        ],
      ],
    ]
  `);
});

it('As a developer, I can use `IfAllowed` component for pass permission check result via render props.', () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed permissions={[['data', 'Users', 'create']]}>{(allowed: boolean) => `Allowed = ${allowed}`}</IfAllowed>
  ));

  const tree = renderer.create(<PermissionsProvider>{testRenderFn}</PermissionsProvider>);

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true"');
});

it('As a developer, I can use `IfAllowed` in order to check fields permissions if allowed.', () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed permissions={[['data', 'Users', 'update']]}>
      {(allowed: boolean, [{ fields }]: any[]) => `Allowed = ${allowed}, allowed to change email = ${fields.email}`}
    </IfAllowed>
  ));

  const tree = renderer.create(<PermissionsProvider>{testRenderFn}</PermissionsProvider>);

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true, allowed to change email = false"');
});

it('As a developer, I can use `isAllowed` for check field access via context.', () => {
  const TestComponent = ({ permissions }: any) => {
    const allowed = isAllowed(
      {
        resource: 'Users',
        type: 'data',
        permission: 'update',
        field: 'firstName',
      },
      permissions,
    );

    const unexistedFieldAllowed = isAllowed(
      {
        resource: 'Users',
        type: 'data',
        permission: 'update',
        field: 'unexistedField',
      },
      permissions,
    );

    return `Allowed = ${allowed}, UnexistedFieldAllowed = ${unexistedFieldAllowed}`;
  };

  // @ts-ignore
  const TestComponentWrapper = withPermissions(TestComponent);

  const tree = renderer.create(<PermissionsProvider>{() => <TestComponentWrapper />}</PermissionsProvider>);

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true, UnexistedFieldAllowed = true"');
});

it('As a developer, I can use usePermissions hook', () => {
  const TestComponent = () => {
    const permissions: any = usePermissions();

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
  };

  // @ts-ignore
  const tree = renderer.create(<PermissionsProvider>{() => <TestComponent />}</PermissionsProvider>);

  expect(tree.toJSON()).toMatchInlineSnapshot('"Allowed = true"');
});
