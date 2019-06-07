export type ApolloDataPermissionOperationTypes = 'create' | 'read' | 'update' | 'delete';

export type ApolloDataPermissionOperationFilter = { [key: string]: any };

export type ApolloDataPermissionOperationFields = { [key: string]: boolean };

export type ApolloDataPermissionOperation = {
  allow: boolean;
  filter: ApolloDataPermissionOperationFilter;
  fields: ApolloDataPermissionOperationFields;
};

export type ApolloDataPermission = Record<ApolloDataPermissionOperationTypes, ApolloDataPermissionOperation>;

export type ApolloPermission = {
  appId: 'system' | 'default';
  resourceType: string;
  resource: string;
  permission: ApolloDataPermission;
};

export type TransformedPermissions = {
  [key: string]: {
    [key: string]: ApolloPermission;
  };
};

export type RequestPermissions = {
  uset: {
    permissions: {
      items: ApolloPermission[];
    };
  };
};
