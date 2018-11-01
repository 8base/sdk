import nock from 'nock';

import { TABLES, DATA } from '../__fixtures__';
import { Client, importData } from '../../src';

beforeEach(() => {
  nock.cleanAll();
});

it('As a developer, I can export schema of the user tables.', async () => {
  const mocks = [
    mockRequest('https://api.test.8base.com', 200, {
      data: {
        tablesList: {
          items: TABLES,
        },
      },
    }),
    mockRequest('https://api.test.8base.com', 200, {
      data: {
        field: {
          id: 'remote-client-1',
        },
      },
    }),
    mockRequest('https://api.test.8base.com', 200, {
      data: {
        field: {
          id: 'remote-order-1',
        },
      },
    }),
    mockRequest('https://api.test.8base.com', 200, {
      data: {
        field: {
          id: 'remote-order-2',
        },
      },
    }),
    mockRequest('https://api.test.8base.com', 200, {
      data: {
        user: {
          id: 'USER_ID',
        },
      },
    }),
    mockRequest('https://api.test.8base.com'),
    mockRequest('https://api.test.8base.com'),
    mockRequest('https://api.test.8base.com'),
  ];

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');

  await importData(client.request.bind(client), DATA);

  expect(await Promise.all(mocks)).toMatchSnapshot();
});
