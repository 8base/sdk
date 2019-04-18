import * as nock from 'nock';

import { Client, exportData } from '../../src';
import { TABLES, FILES_TABLE, USER_TABLES, CLIENTS_TABLE, SYSTEM_DATA, DATA } from '../__fixtures__';

beforeEach(() => {
  nock.cleanAll();
});

const tablesResponse = () => ({
  data: {
    tablesList: {
      items: [FILES_TABLE],
    },
  },
});

describe('exportData', () => {
  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');

  it('should export data from workspace with system tables', async () => {
    const mocks = [
      global.mockRequest('https://api.test.8base.com', 200, {
        data: {
          usersList: {
            items: SYSTEM_DATA.users,
          },
        },
      }),
      global.mockRequest('https://api.test.8base.com', 200, tablesResponse),
      global.mockRequest('https://api.test.8base.com', 200, {
        data: {
          clientsList: {
            items: DATA.clients,
          },
        },
      }),
      global.mockRequest('https://api.test.8base.com', 200, {
        data: {
          ordersList: {
            items: DATA.orders,
          },
        },
      }),
    ];

    const workspaceData = await exportData(client.request.bind(client), TABLES);

    expect(await Promise.all(mocks)).toMatchSnapshot();
    expect(workspaceData).toMatchSnapshot();
  });

  it('should export data from workspace without system tables', async () => {
    const mocks = [
      global.mockRequest('https://api.test.8base.com', 200, tablesResponse),
      global.mockRequest('https://api.test.8base.com', 200, {
        data: {
          clientsList: {
            items: DATA.clients,
          },
        },
      }),
      global.mockRequest('https://api.test.8base.com', 200, {
        data: {
          ordersList: {
            items: DATA.orders,
          },
        },
      }),
      global.mockRequest('https://api.test.8base.com', 200, {
        data: {
          filesList: {
            items: [],
          },
        },
      }),
    ];

    const workspaceData = await exportData(client.request.bind(client), USER_TABLES);

    expect(await Promise.all(mocks)).toMatchSnapshot();
    expect(workspaceData).toMatchSnapshot();
  });

  describe('should have ability to choose which tables to export', () => {
    it('include', async () => {
      const mocks = [
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            filesList: {
              items: [],
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            clientsList: {
              items: DATA.clients,
            },
          },
        }),
      ];

      const workspaceData = await exportData(client.request.bind(client), USER_TABLES, {
        tables: {
          include: [CLIENTS_TABLE.name],
        },
      });

      expect(await Promise.all(mocks)).toMatchSnapshot();
      expect(workspaceData).toMatchSnapshot();
    });

    it('exclude', async () => {
      const mocks = [
        global.mockRequest('https://api.test.8base.com', 200, tablesResponse),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            ordersList: {
              items: DATA.orders,
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            filesList: {
              items: [],
            },
          },
        }),
      ];

      const workspaceData = await exportData(client.request.bind(client), USER_TABLES, {
        tables: {
          exclude: [CLIENTS_TABLE.name],
        },
      });

      expect(await Promise.all(mocks)).toMatchSnapshot();
      expect(workspaceData).toMatchSnapshot();
    });
  });
});
