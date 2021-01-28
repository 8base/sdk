import * as nock from 'nock';

import { Client, exportTables } from '../../src';
import { TABLES } from '../__fixtures__';

beforeEach(() => {
  nock.cleanAll();
});

it('As a developer, I can export schema of the user tables.', async () => {
  const mock = global.mockRequest('https://api.test.8base.com', 200, {
    data: {
      tablesList: {
        items: TABLES,
      },
    },
  });

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');

  const schemaTables = await exportTables(client.request.bind(client));

  expect(schemaTables).toMatchSnapshot();
  expect(await mock).toMatchSnapshot();
});
