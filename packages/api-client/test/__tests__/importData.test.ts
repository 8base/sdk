import * as nock from 'nock';
import * as filestack from 'filestack-js';

import { WORKSPACE_WITH_RELATIONS, WORKSPACE_WITHOUT_RELATIONS, WORKSPACE_WITH_FILES } from '../__fixtures__';
import { Client, importData } from '../../src';

let init: jest.SpyInstance;
let storeURL: jest.Mock;
let upload: jest.Mock;

beforeEach(() => {
  nock.cleanAll();

  let currentId = 0;

  storeURL = jest.fn(() => ({
    handle: 'file-id-' + currentId++,
  }));

  upload = jest.fn(() => ({
    handle: 'file-id-' + currentId++,
  }));

  // @ts-ignore
  init = jest.spyOn(filestack, 'init').mockImplementation(() => ({
    storeURL,
    upload,
  }));
});

afterEach(() => {
  init.mockRestore();
});

describe('importData', () => {
  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');

  describe('with relations (required and non-required)', () => {
    it('should fetch tables and import', async () => {
      const mocks = [
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            user: {
              id: 'currentUserId',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            fileUploadInfo: {
              apiKey: 'apiKey',
              policy: 'policy',
              signature: 'signature',
              path: 'path',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            tablesList: {
              items: WORKSPACE_WITH_RELATIONS.tables,
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-first-1',
              second: {
                id: 'remote-second-1',
              },
              fourth: {
                id: 'remote-fourth-1',
              },
              fifth: {
                id: 'remote-fifth-1',
              },
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-third-1',
            },
          },
        }),
      ];

      await importData(client.request.bind(client), WORKSPACE_WITH_RELATIONS.data);

      expect(await Promise.all(mocks)).toMatchSnapshot();
    });

    it('should import with provided tables', async () => {
      const mocks = [
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            user: {
              id: 'currentUserId',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            fileUploadInfo: {
              apiKey: 'apiKey',
              policy: 'policy',
              signature: 'signature',
              path: 'path',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            tablesList: {
              items: [],
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-first-1',
              second: {
                id: 'remote-second-1',
              },
              fourth: {
                id: 'remote-fourth-1',
              },
              fifth: {
                id: 'remote-fifth-1',
              },
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-third-1',
            },
          },
        }),
      ];

      await importData(client.request.bind(client), WORKSPACE_WITH_RELATIONS.data, {
        tablesSchema: WORKSPACE_WITH_RELATIONS.tables,
      });

      expect(await Promise.all(mocks)).toMatchSnapshot();
    });
  });

  describe('without relations', () => {
    it('should import', async () => {
      const mocks = [
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            user: {
              id: 'currentUserId',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            fileUploadInfo: {
              apiKey: 'apiKey',
              policy: 'policy',
              signature: 'signature',
              path: 'path',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            tablesList: {
              items: [],
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-first-1',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-first-2',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-second-1',
            },
          },
        }),
      ];

      await importData(client.request.bind(client), WORKSPACE_WITHOUT_RELATIONS.data, {
        tablesSchema: WORKSPACE_WITHOUT_RELATIONS.tables,
      });

      expect(await Promise.all(mocks)).toMatchSnapshot();
    });
  });

  describe('with files', () => {
    it('should import', async () => {
      const mocks = [
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            user: {
              id: 'currentUserId',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            fileUploadInfo: {
              apiKey: 'apiKey',
              policy: 'policy',
              signature: 'signature',
              path: 'path',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-file-1',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-file-2',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-file-3',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-file-4',
            },
          },
        }),
        global.mockRequest('https://api.test.8base.com', 200, {
          data: {
            remoteEntry: {
              id: 'remote-first-1',
            },
          },
        }),
      ];

      await importData(client.request.bind(client), WORKSPACE_WITH_FILES.data, {
        tablesSchema: WORKSPACE_WITH_FILES.tables,
      });

      expect(storeURL).toBeCalledTimes(1);
      expect(upload).toBeCalledTimes(3);
      expect(await Promise.all(mocks)).toMatchSnapshot();
    });
  });
});
