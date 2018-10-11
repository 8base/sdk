// @flow
import {
  createTableFilterGraphqlTag,
  createTableRowCreateTag,
  createTableRowQueryTag,
  createTableRowUpdateTag,
  createTableRowDeleteTag,
} from '../../src/queryTableGenerator';

import * as fixtures from '../__fixtures__';

describe('As a developer, I can generate graphql query for list by table schema', () => {
  it('should generate graphql tag for the table content by common table schema ', () => {
    const tag = createTableFilterGraphqlTag(fixtures.COMMON_TABLE_SCHEMA);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with relation', () => {
    const tag = createTableFilterGraphqlTag(fixtures.TABLE_SCHEMA_WITH_RELATION);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for the table content by table schema with custom fields', () => {
    const tag = createTableFilterGraphqlTag(fixtures.TABLE_SCHEMA_WITH_CUSTOM_FIELDS);

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for create entity by table schema', () => {
  it('should generate graphql tag for create mutation by common table schema ', () => {
    const tag = createTableRowCreateTag(fixtures.COMMON_TABLE_SCHEMA);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with relation', () => {
    const tag = createTableRowCreateTag(fixtures.TABLE_SCHEMA_WITH_RELATION);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with custom fields', () => {
    const tag = createTableRowCreateTag(fixtures.TABLE_SCHEMA_WITH_CUSTOM_FIELDS);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for create mutation by table schema with custom fields', () => {
    const tag = createTableRowCreateTag(fixtures.TABLE_SCHEMA_WITHOUT_USER_FIELDS);

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql query for read entity by table schema', () => {
  it('should generate graphql tag for row query by common table schema ', () => {
    const tag = createTableRowQueryTag(fixtures.COMMON_TABLE_SCHEMA);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with relation', () => {
    const tag = createTableRowQueryTag(fixtures.TABLE_SCHEMA_WITH_RELATION);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for row query by table schema with custom fields', () => {
    const tag = createTableRowQueryTag(fixtures.TABLE_SCHEMA_WITH_CUSTOM_FIELDS);

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for update entity by table schema', () => {
  it('should generate graphql tag for update mutation by common table schema ', () => {
    const tag = createTableRowUpdateTag(fixtures.COMMON_TABLE_SCHEMA);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with relation', () => {
    const tag = createTableRowUpdateTag(fixtures.TABLE_SCHEMA_WITH_RELATION);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for update mutation by table schema with custom fields', () => {
    const tag = createTableRowUpdateTag(fixtures.TABLE_SCHEMA_WITH_CUSTOM_FIELDS);

    expect(tag).toMatchSnapshot();
  });
});

describe('As a developer, I can generate graphql mutation for delete entity by table schema', () => {
  it('should generate graphql tag for delete mutation by common table schema ', () => {
    const tag = createTableRowDeleteTag(fixtures.COMMON_TABLE_SCHEMA);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with relation', () => {
    const tag = createTableRowDeleteTag(fixtures.TABLE_SCHEMA_WITH_RELATION);

    expect(tag).toMatchSnapshot();
  });

  it('should generate graphql tag for delete mutation by table schema with custom fields', () => {
    const tag = createTableRowDeleteTag(fixtures.TABLE_SCHEMA_WITH_CUSTOM_FIELDS);

    expect(tag).toMatchSnapshot();
  });
});
