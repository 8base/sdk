import * as R from 'ramda';
import gql from 'graphql-tag';
import {
  execute,
  ApolloLink,
  Observable,
} from 'apollo-link';

import {
  findFilePaths,
  getFiles,
  dissocFileProps,
  createFiles,
  replaceLastCreatePropByConnectProp,
  assocConnectFieldsWithFileIds,
  dissocCreateFields,
  fileUploadLink,
  FILE_PROP,
  MAX_OBJECT_DEPTH,
} from '../../src/fileUploadLink';

import { createFile } from '../../src/utils/createFile';

jest.mock('../../src/utils/createFile');

describe('findFilePaths function', () => {
  it('finds file\'s path in nested objects', () => {
    const variables = {
      field1: 42,
      field2: {
        field1: 42,
        field2: {
          create: {
            [FILE_PROP]: new File([], ''),
          },
        },
      },
    };

    expect(findFilePaths(variables)).toEqual([
      ['field2', 'field2', 'create', FILE_PROP],
    ]);
  });

  it('finds file\'s path in nested array', () => {
    const variables = {
      field1: {
        field1: 42,
        field2: 43,
      },
      field2: {
        field1: [
          [
            {
              create: [
                {},
                {},
                {
                  [FILE_PROP]: new File([], ''),
                },
              ],
            },
          ],
        ],
        field2: [
          42,
        ],
      },
    };

    expect(findFilePaths(variables)).toEqual([
      ['field2', 'field1', 0, 0, 'create', 2, FILE_PROP],
    ]);
  });

  it('finds multiple file\'s paths', () => {
    const variables = {
      field1: {
        field1: 42,
        field2: 43,
      },
      field2: {
        create: [
          {
            [FILE_PROP]: new File([], ''),
          },
          {
            [FILE_PROP]: new File([], ''),
          },
        ],
        field2: [
          42,
          {
            field1: {},
            field2: {
              create: {
                [FILE_PROP]: new File([], ''),
              },
            },
          },
        ],
      },
      create: [
        {
          [FILE_PROP]: new File([], ''),
        },
      ],
    };

    expect(findFilePaths(variables)).toEqual([
      ['field2', 'create', 0, FILE_PROP],
      ['field2', 'create', 1, FILE_PROP],
      ['field2', 'field2', 1, 'field2', 'create', FILE_PROP],
      ['create', 0, FILE_PROP],
    ]);
  });

  it(`doesn't find deeper than maximum allowed depth: ${MAX_OBJECT_DEPTH}`, () => {
    const variables = R.assocPath(
      R.repeat('field', MAX_OBJECT_DEPTH + 1),
      {
        create: {
          [FILE_PROP]: new File([], ''),
        },
      },
      {},
    );

    expect(findFilePaths(variables)).toEqual([]);
  });
});

describe('getFiles function', () => {
  it('gets files by their paths', () => {
    const files = [
      new File([], ''),
      new File([], ''),
    ];
    const filePaths = [
      ['field1', 'create', FILE_PROP],
      ['field2', 'field1', 'create', 0, FILE_PROP],
    ];
    const variables = {
      field1: {
        create: {
          [FILE_PROP]: files[0],
        },
      },
      field2: {
        field1: {
          create: [
            {
              [FILE_PROP]: files[1],
            },
          ],
        },
      },
    };

    const resultFiles = getFiles(filePaths, variables);
    expect(resultFiles).toHaveLength(2);
    expect(resultFiles[0]).toBe(files[0]);
    expect(resultFiles[1]).toBe(files[1]);
  });
});

describe('dissocFileProps function', () => {
  it('removes files from variables', () => {
    const files = [
      new File([], ''),
      new File([], ''),
    ];
    const filePaths = [
      ['field1', 'create', FILE_PROP],
      ['field2', 'field1', 'create', 0, FILE_PROP],
    ];
    const variables = {
      field1: {
        create: {
          [FILE_PROP]: files[0],
        },
      },
      field2: {
        field1: {
          create: [
            {
              [FILE_PROP]: files[1],
            },
          ],
        },
      },
    };

    expect(dissocFileProps(filePaths, variables)).toEqual({
      field1: {
        create: {},
      },
      field2: {
        field1: {
          create: [
            {},
          ],
        },
      },
    });
  });
});

describe('createFiles function', () => {
  const files = [
    new File([], ''),
    new File([], ''),
  ];
  const fileFields = [
    {
      filename: 'test',
      public: true,
    },
    {
      filename: 'test1',
      public: false,
    },
  ];
  const fileFieldPaths = [
    ['field1', 'create', 0],
    ['field1', 'create', 1],
  ];
  const variables = {
    field1: {
      create: [
        ...fileFields,
      ],
    },
  };
  const mutate = () => {};

  const result = createFiles(files, fileFieldPaths, variables, mutate);

  it('calls uploadFileLink function for every file', () => {
    expect(createFile).toHaveBeenCalledTimes(2);
    expect(createFile).toHaveBeenNthCalledWith(
      1,
      {
        file: files[0],
        fileMeta: fileFields[0],
      },
      mutate,
    );
    expect(createFile).toHaveBeenNthCalledWith(
      2,
      {
        file: files[1],
        fileMeta: fileFields[1],
      },
      mutate,
    );
  });

  it('returns Promise', () => {
    expect(result).toBeInstanceOf(Promise);
  });
});

describe('replaceLastCreatePropByConnectProp function', () => {
  it('replaces the last \'create\' prop in a path chain by \'connect\' prop', () => {
    const fileFieldPath = ['field1', 'field1', 'create', 0];

    expect(replaceLastCreatePropByConnectProp(fileFieldPath)).toEqual(['field1', 'field1', 'connect', 0]);
  });
});

describe('assocConnectFieldsWithFileIds function', () => {
  it('returns new \'variables\' object with connect fields filled with file ids', () => {
    const fileFieldPaths = [
      ['field1', 'field1', 'create', 0],
      ['field1', 'field1', 'create', 1],
      ['field1', 'field2', 'create'],
    ];
    const createdFiles = [
      {
        id: '1',
        fileId: '',
        filename: '',
        uploadUrl: '',
        fields: {},
      },
      {
        id: '2',
        fileId: '',
        filename: '',
        uploadUrl: '',
        fields: {},
      },
      {
        id: '3',
        fileId: '',
        filename: '',
        uploadUrl: '',
        fields: {},
      },
    ];
    const variables = {
      field1: {
        field1: {
          create: [
            {},
            {},
          ],
        },
        field2: {
          create: {},
        },
      },
    };

    expect(assocConnectFieldsWithFileIds(fileFieldPaths, createdFiles, variables)).toEqual({
      field1: {
        field1: {
          create: [
            {},
            {},
          ],
          connect: [
            { id: '1' },
            { id: '2' },
          ],
        },
        field2: {
          create: {},
          connect: { id: '3' },
        },
      },
    });
  });
});

describe('dissocCreateFields function', () => {
  const fileFieldPaths = [
    ['field1', 'field1', 'create', 0],
    ['field1', 'field1', 'create', 1],
    ['field1', 'field2', 'create'],
  ];
  const variables = {
    field1: {
      field1: {
        create: [
          {},
          {},
        ],
      },
      field2: {
        create: {},
      },
    },
  };

  it('removes \'create\' fields from \'variables\' object', () => {
    expect(dissocCreateFields(fileFieldPaths, variables)).toEqual({
      field1: {
        field1: {},
        field2: {},
      },
    });
  });
});

describe('As a developer i can use fileUploadLink for file uploading functionality', () => {
  const files = [
    new File([], ''),
    new File([], ''),
    new File([], ''),
  ];
  const createdFiles = [
    {
      id: '1',
      fileId: '',
      filename: '',
      uploadUrl: '',
      fields: {},
    },
    {
      id: '2',
      fileId: '',
      filename: '',
      uploadUrl: '',
      fields: {},
    },
    {
      id: '3',
      fileId: '',
      filename: '',
      uploadUrl: '',
      fields: {},
    },
  ];
  const variables = {
    field1: {
      field1: {
        create: [
          {
            [FILE_PROP]: files[0],
          },
          {
            [FILE_PROP]: files[1],
          },
        ],
      },
      field2: {
        create: {
          [FILE_PROP]: files[2],
        },
      },
    },
  };
  const query = gql`
    mutation {
      sample {
        id
      }
    }
  `;
  const stubLink = jest.fn(() => Observable.of({}));
  const links = ApolloLink.from([
    fileUploadLink, stubLink,
  ]);

  createFile.mockImplementationOnce(() => Promise.resolve(createdFiles[0]));
  createFile.mockImplementationOnce(() => Promise.resolve(createdFiles[1]));
  createFile.mockImplementationOnce(() => Promise.resolve(createdFiles[2]));

  it(
    'forwards to the next link variables with \'connect\' fields and without \'create\' fields',
    () => new Promise((resolve, reject) => {
      execute(links, { query, variables }).subscribe(
        () => { },
        () => reject(),
        () => {
          expect(stubLink).toHaveBeenCalledWith({
            variables: {
              field1: {
                field1: {
                  connect: [
                    {
                      id: createdFiles[0].id,
                    },
                    {
                      id: createdFiles[1].id,
                    },
                  ],
                },
                field2: {
                  connect: {
                    id: createdFiles[2].id,
                  },
                },
              },
            },
            extensions: {},
            operationName: null,
            query,
          });
          resolve();
        },
      );
    }),
  );
});
