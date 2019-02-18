// @flow
import {
  createTableFilterGraphqlTag,
  createTableRowCreateTag,
  createTableRowQueryTag,
  createTableRowUpdateTag,
  createTableRowDeleteTag,
  getQueryObject,
  createQueryColumnsList,
} from '../../src/queryTableGenerator';

import * as fixtures from '../__fixtures__';


describe('As a developer, I can generate table columns  by table schema', () => {
  it('should generate table columns list ', () => {
    const columnsList = createQueryColumnsList(fixtures.SCHEMA, 'tableSchema');

    expect(columnsList).toMatchSnapshot();
  });

  it('should generate table columns list with included columns', () => {
    const columnsList = createQueryColumnsList(fixtures.SCHEMA, 'tableSchema', { includeColumns: [
      'number',
      'relation.scalarList',
      'relation.relationList',
      'relationList',
    ] });

    expect(columnsList).toMatchSnapshot();
  });
});


describe('As a developer, I can generate graphql query for list by table schema', () => {
  it('should generate query object ', () => {
    const queryObject = getQueryObject(fixtures.SCHEMA, 'tableSchema');

    expect(queryObject).toMatchSnapshot();
  });

  it('should generate query string ', () => {
    const queryObject = createTableFilterGraphqlTag(fixtures.SCHEMA, 'tableSchema', {
      includeColumns: [
        'number',
        'numberList',
        'relation.scalarList',
        'relation.relationList',
        'relationList',
      ],
    });

    expect(queryObject).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by common table schema ', () => {
    const tag = createTableFilterGraphqlTag([fixtures.COMMON_TABLE_SCHEMA], 'commons');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with files', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'Files');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with relation', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'Relation');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with smart fields', () => {
    const tag = createTableFilterGraphqlTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SmartFields');

    expect(tag).toMatchSnapshot();
  });
});


describe('As a developer, I can generate graphql mutation for create entity by table schema', () => {
  it('should generate graphql tag for create mutation by common table schema ', () => {
    const tag = createTableRowCreateTag([fixtures.COMMON_TABLE_SCHEMA], 'commons');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with files', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'Files');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with relation', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'Relation');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with smart fields', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SmartFields');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with smart fields', () => {
    const tag = createTableRowCreateTag([fixtures.TABLE_SCHEMA_WITHOUT_USER_FIELDS], 'TableWithoutUserFields');

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql query for read entity by table schema', () => {
  it('should generate graphql tag for row query by common table schema ', () => {
    const tag = createTableRowQueryTag([fixtures.COMMON_TABLE_SCHEMA], 'commons');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with files', () => {
    const tag = createTableRowQueryTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'Files');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with relation', () => {
    const tag = createTableRowQueryTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'Relation');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with smart fields', () => {
    const tag = createTableRowQueryTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SmartFields');

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for update entity by table schema', () => {
  it('should generate graphql tag for update mutation by common table schema ', () => {
    const tag = createTableRowUpdateTag([fixtures.COMMON_TABLE_SCHEMA], 'commons');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with files', () => {
    const tag = createTableRowUpdateTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'Files');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with relation', () => {
    const tag = createTableRowUpdateTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'Relation');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with smart fields', () => {
    const tag = createTableRowUpdateTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SmartFields');

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for delete entity by table schema', () => {
  it('should generate graphql tag for delete mutation by common table schema ', () => {
    const tag = createTableRowDeleteTag([fixtures.COMMON_TABLE_SCHEMA], 'commons');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with files', () => {
    const tag = createTableRowDeleteTag([fixtures.TABLE_SCHEMA_WITH_FILES], 'Files');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with relation', () => {
    const tag = createTableRowDeleteTag([fixtures.TABLE_SCHEMA_WITH_RELATION], 'Relation');

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with smart fields', () => {
    const tag = createTableRowDeleteTag([fixtures.TABLE_SCHEMA_WITH_SMART_FIELDS], 'SmartFields');

    expect(tag).toMatchSnapshot();
  });
});

