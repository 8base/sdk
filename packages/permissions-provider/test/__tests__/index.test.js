import React from "react";
import renderer from "react-test-renderer";

import {
  IfAllowed,
  PermissionsProvider,
  isAllowed,
  PermissionContext
} from "../../src";

const mockDATA = {
  user: {
    roles: {
      items: [
        {
          permissions: {
            items: [
              {
                resource: "Users",
                resourceType: "data",
                permission: {
                  create: {
                    allow: true
                  },
                  delete: {
                    allow: true
                  },
                  read: {
                    allow: true
                  },
                  update: {
                    allow: true,
                    filter: {
                      id: {
                        equals: "__loggedInUserId"
                      }
                    }
                  }
                }
              },
              {
                resource: "schema",
                resourceType: "custom",
                permission: {
                  edit: {
                    allow: false
                  }
                }
              }
            ]
          }
        },
        {
          permissions: {
            items: [
              {
                resource: "Users",
                resourceType: "data",
                permission: {
                  create: {
                    allow: true
                  },
                  delete: {
                    allow: true
                  },
                  read: {
                    allow: true
                  },
                  update: {
                    allow: true,
                    filter: {
                      id: {
                        equals: "__loggedInUserId"
                      }
                    }
                  }
                }
              },
              {
                resource: "schema",
                resourceType: "custom",
                permission: {
                  edit: {
                    allow: false
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
};

jest.mock("@8base/auth", () => ({
  withAuth: Component => props => (
    <Component {...props} auth={{ isAuthorized: true }} />
  )
}));

jest.mock("react-apollo", () => ({
  Query: ({ children }) => children({ data: mockDATA, loading: false })
}));

it("As a developer, I can use `IfAllowed` component for conditional rendering based user permissions.", () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed resource="Users" type="data" permission="create">
      Allowed
    </IfAllowed>
  ));

  const tree = renderer.create(
    <PermissionsProvider name="tableName">{testRenderFn}</PermissionsProvider>
  );

  expect(tree.toJSON()).toMatchInlineSnapshot(`"Allowed"`);
});

it("As a developer, I can use `IfAllowed` component for pass permission check result via render props.", () => {
  const testRenderFn = jest.fn(() => (
    <IfAllowed resource="Users" type="data" permission="create">
      {allowed => `Allowed = ${allowed}`}
    </IfAllowed>
  ));

  const tree = renderer.create(
    <PermissionsProvider name="tableName">{testRenderFn}</PermissionsProvider>
  );

  expect(tree.toJSON()).toMatchInlineSnapshot(`"Allowed = true"`);
});

it("As a developer, I can use `isAllowed` for check access via context.", () => {
  class TestComponent extends React.Component {
    static contextType = PermissionContext;

    render() {
      const allowed = isAllowed(
        {
          resource: "schema",
          type: "custom",
          permission: "edit"
        },
        this.context
      );

      return `Allowed = ${allowed}`;
    }
  }

  const tree = renderer.create(
    <PermissionsProvider name="tableName">
      {() => <TestComponent />}
    </PermissionsProvider>
  );

  expect(tree.toJSON()).toMatchInlineSnapshot(`"Allowed = false"`);
});
