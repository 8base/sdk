export const SYSTEM_TABLE = {
  id: 'usersTableId',
  name: 'Users',
  displayName: 'Users',
  isSystem: true,
  fields: [
    {
      id: '5bd9b58e7bc6e85182df1886',
      name: 'client',
      displayName: 'Client',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: {
        refFieldName: 'user',
        refFieldDisplayName: 'User',
        relationTableName: 'y16z0t27',
        relationFieldName: 'aid',
        refTable: {
          id: 'clientsTableId',
          name: 'clients',
        },
        refFieldIsList: false,
        refFieldIsRequired: false,
      },
    },
  ],
};

export const CLIENTS_TABLE = {
  id: 'clientsTableId',
  name: 'clients',
  displayName: 'Clients',
  isSystem: false,
  fields: [
    {
      id: 'clientsIdFieldId',
      name: 'id',
      displayName: 'ID',
      description: null,
      fieldType: 'ID',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: true,
      isUnique: true,
      defaultValue: null,
      isSystem: true,
      isMeta: true,
      relation: null,
    },
    {
      id: 'clientsUserFieldId',
      name: 'user',
      displayName: 'User',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: {
        refFieldName: 'client',
        refFieldDisplayName: 'Client',
        relationTableName: 'y16z0t27',
        relationFieldName: 'aid',
        refTable: {
          id: 'usersTableId',
          name: 'Users',
        },
        refFieldIsList: true,
        refFieldIsRequired: false,
      },
    },
    {
      id: 'clientsFullNameFieldId',
      name: 'fullName',
      displayName: 'Full Name',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 500,
      },
      isList: false,
      isRequired: false,
      isUnique: false,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: null,
    },
    {
      id: 'clientsUserFieldId',
      name: 'orders',
      displayName: 'Orders',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: {
        refFieldName: 'client',
        refFieldDisplayName: 'Client',
        relationTableName: 'y16z0t27',
        relationFieldName: 'aid',
        refTable: {
          id: 'ordersTableId',
          name: 'orders',
        },
        refFieldIsList: false,
        refFieldIsRequired: false,
      },
    },
  ],
};

export const ORDERS_TABLE = {
  id: 'ordersTableId',
  name: 'orders',
  displayName: 'Orders',
  isSystem: false,
  fields: [
    {
      id: 'ordersIdFieldId',
      name: 'id',
      displayName: 'ID',
      description: null,
      fieldType: 'ID',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: true,
      isUnique: true,
      defaultValue: null,
      isSystem: true,
      isMeta: true,
      relation: null,
    },
    {
      id: 'clientsUserFieldId',
      name: 'client',
      displayName: 'Clients',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: {
        refFieldName: 'order',
        refFieldDisplayName: 'Order',
        relationTableName: 'y16z0t27',
        relationFieldName: 'aid',
        refTable: {
          id: 'clientsTableId',
          name: 'clients',
        },
        refFieldIsList: true,
        refFieldIsRequired: false,
      },
    },
  ],
};

export const DATA = {
  clients: [
    {
      $id: 'client-1',
      fullName: 'Jacalyn Mccarrel',
      user: {
        $id: '$currentUserId',
      },
      orders: [
        {
          $id: 'order-1',
        },
        {
          $id: 'order-2',
        },
      ],
    },
  ],
  orders: [
    {
      $id: 'order-1',
      client: {
        $id: 'client-1',
      },
    },
    {
      $id: 'order-2',
      client: {
        $id: 'client-1',
      },
    },
  ],
};

export const TABLES = [SYSTEM_TABLE, CLIENTS_TABLE, ORDERS_TABLE];
export const USER_TABLES = [CLIENTS_TABLE, ORDERS_TABLE];
