import {
  createTableFilterGraphqlTag,
  createTableRowCreateTag,
  createTableRowQueryTag,
  createTableRowUpdateTag,
  createTableRowDeleteTag,
  createQueryColumnsList,
  createTableRowCreateManyTag,
} from '../../src';

import * as fixtures from '../__fixtures__';

describe('As a developer, I can generate table columns  by table schema', () => {
  it('should generate table columns list ', () => {
    const columnsList = createQueryColumnsList(fixtures.SCHEMA, 'TABLE_SCHEMA_ID', {
      deep: 3,
      withMeta: false,
    });

    expect(columnsList).toMatchSnapshot();
  });

  it('should generate table columns list with included columns', () => {
    const columnsList = createQueryColumnsList(fixtures.SCHEMA, 'TABLE_SCHEMA_ID', {
      deep: 3,
      includeColumns: ['number', 'relation.scalarList', 'relation.numberanother', 'relationList'],
      withMeta: false,
    });

    expect(columnsList).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql query for list by table schema', () => {
  it('should generate query string ', () => {
    const querString = createTableFilterGraphqlTag(fixtures.SCHEMA, 'TABLE_SCHEMA_ID', {
      includeColumns: [
        'number',
        'numberList',
        'relation',
        'relation.scalarList',
        'relation.relationList',
        'relationList',
      ],
    });

    expect(querString).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by common table schema ', () => {
    const tag = createTableFilterGraphqlTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with files', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'FILES_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with relation', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with some relation count', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID', {
      relationItemsCount: 5,
    });

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with smart fields', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SMART_FIELD_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema for application', () => {
    const tag = createTableFilterGraphqlTag(
      [fixtures.COMMON_SALESFORCE_TABLE_SCHEMA],
      'COMMON_SALESFORCE_TABLE_SCHEMA_ID',
    );

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for create entity by table schema', () => {
  it('should generate graphql tag for create mutation by common table schema ', () => {
    const tag = createTableRowCreateTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with files', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'FILES_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with relation', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with smart fields', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SMART_FIELD_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with smart fields', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITHOUT_USER_FIELDS], 'TABLE_WITHOUT_USER_FIELDS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema for application', () => {
    const tag = createTableRowCreateTag([fixtures.COMMON_SALESFORCE_TABLE_SCHEMA], 'COMMON_SALESFORCE_TABLE_SCHEMA_ID');

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for create many entities by table schema', () => {
  it('should generate graphql tag for create mutation by common table schema ', () => {
    const tag = createTableRowCreateManyTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with files', () => {
    const tag = createTableRowCreateManyTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'FILES_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with relation', () => {
    const tag = createTableRowCreateManyTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with smart fields', () => {
    const tag = createTableRowCreateManyTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SMART_FIELD_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with smart fields', () => {
    const tag = createTableRowCreateManyTag(
      [fixtures.TABLE_SCHEMA_WITHOUT_USER_FIELDS],
      'TABLE_WITHOUT_USER_FIELDS_ID',
    );

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema for application', () => {
    const tag = createTableRowCreateManyTag(
      [fixtures.COMMON_SALESFORCE_TABLE_SCHEMA],
      'COMMON_SALESFORCE_TABLE_SCHEMA_ID',
    );

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql query for read entity by table schema', () => {
  it('should generate graphql tag for row query by common table schema ', () => {
    const tag = createTableRowQueryTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with files', () => {
    const tag = createTableRowQueryTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'FILES_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with relation', () => {
    const tag = createTableRowQueryTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with smart fields', () => {
    const tag = createTableRowQueryTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SMART_FIELD_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by common table schema according permissions', () => {
    const tag = createTableRowQueryTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID', {
      permissions: {
        data: {
          commons: {
            permission: {
              read: {
                allow: true,
                fields: {
                  field1: false,
                },
              },
            },
          },
        },
      },
    });

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with relation according permissions', () => {
    const tag = createTableRowQueryTag(fixtures.SCHEMA, 'TABLE_SCHEMA_ID', {
      permissions: {
        data: {
          relationTableSchema: {
            permission: {
              read: {
                allow: false,
              },
            },
          },
        },
      },
    });
  });

  it('should generate graphql tag for row query by table schema for application', () => {
    const tag = createTableRowQueryTag([fixtures.COMMON_SALESFORCE_TABLE_SCHEMA], 'COMMON_SALESFORCE_TABLE_SCHEMA_ID');

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for update entity by table schema', () => {
  it('should generate graphql tag for update mutation by common table schema ', () => {
    const tag = createTableRowUpdateTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with files', () => {
    const tag = createTableRowUpdateTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'FILES_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with relation', () => {
    const tag = createTableRowUpdateTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with smart fields', () => {
    const tag = createTableRowUpdateTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SMART_FIELD_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema for application', () => {
    const tag = createTableRowUpdateTag([fixtures.COMMON_SALESFORCE_TABLE_SCHEMA], 'COMMON_SALESFORCE_TABLE_SCHEMA_ID');

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for delete entity by table schema', () => {
  it('should generate graphql tag for delete mutation by common table schema ', () => {
    const tag = createTableRowDeleteTag([fixtures.COMMON_TABLE_SCHEMA], 'COMMONS_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with files', () => {
    const tag = createTableRowDeleteTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'FILES_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with relation', () => {
    const tag = createTableRowDeleteTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'RELATION_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with smart fields', () => {
    const tag = createTableRowDeleteTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SMART_FIELD_ID');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema for application', () => {
    const tag = createTableRowDeleteTag([fixtures.COMMON_SALESFORCE_TABLE_SCHEMA], 'COMMON_SALESFORCE_TABLE_SCHEMA_ID');

    expect(tag).toMatchSnapshot();
  });
});
