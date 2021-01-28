import * as nock from 'nock';

import { Client, importTables } from '../../src';
import { TABLES, USER_TABLES } from '../__fixtures__';

beforeEach(() => {
  nock.cleanAll();
});

it('As a developer, I can export schema of the user tables.', async () => {
  const mocks = [
    global.mockRequest('https://api.test.8base.com'),
    global.mockRequest('https://api.test.8base.com'),
    global.mockRequest('https://api.test.8base.com', 200, {
      data: {
        tablesList: {
          items: TABLES,
        },
      },
    }),
    global.mockRequest('https://api.test.8base.com'),
    global.mockRequest('https://api.test.8base.com'),
    global.mockRequest('https://api.test.8base.com'),
  ];

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');

  await importTables(client.request.bind(client), USER_TABLES as any);

  expect(await Promise.all(mocks)).toMatchSnapshot();
});
