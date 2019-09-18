import React from 'react';
import * as renderer from 'react-test-renderer';
import { TableConsumer, TableSchemaContext, TableSchemaProvider, useTablesList } from '../../src';

const MOCK_TABLES_SCHEMA: any = {
  items: [
    {
      id: '1',
      name: 'tableName',
      displayName: 'Table Name',
      isSystem: false,
      fields: [],
      __typename: 'Table',
    },
    {
      id: '2',
      name: 'tableName',
      displayName: 'Table Name Application',
      application: {
        id: 'APPLICATION_ID',
        name: 'Salesforce',
      },
      isSystem: false,
      fields: [],
      __typename: 'Table',
    },
  ],
  count: 1,
};

jest.mock('react-apollo', () => ({
  Query: ({ children, skip }: any) =>
    skip
      ? children({ data: undefined, loading: false })
      : children({ data: { tablesList: MOCK_TABLES_SCHEMA }, loading: false }),
}));

const { Query } = require('react-apollo'); // tslint:disable-line

describe('TableSchemaProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testContentFn = jest.fn(() => <div />);
  const testConsumerFn = jest.fn(() => <TableConsumer name="tableName">{testContentFn}</TableConsumer>);

  it('As a developer, I can use TableSchemaProvider to get tableSchema', async () => {
    renderer.create(<TableSchemaProvider>{testConsumerFn}</TableSchemaProvider>);

    expect(testConsumerFn).toHaveBeenCalledTimes(1);
    expect(testConsumerFn).toHaveBeenCalledWith({ loading: false });
    expect(testContentFn).toHaveBeenCalledTimes(1);
    expect(testContentFn).toHaveBeenCalledWith({ tableSchema: MOCK_TABLES_SCHEMA.items[0], loading: false });
  });
});

describe('TableConsumer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRenderFn = jest.fn(() => <div />);

  it('As a developer, I can get access to the table schema via TableConsumer by table name.', () => {
    renderer.create(
      <TableSchemaContext.Provider
        value={{ tablesList: MOCK_TABLES_SCHEMA.items, applicationsList: [], loading: false }}
      >
        <TableConsumer name="tableName">{testRenderFn}</TableConsumer>
      </TableSchemaContext.Provider>,
    );

    expect(testRenderFn).toHaveBeenCalledTimes(1);
    expect(testRenderFn).toHaveBeenCalledWith({ tableSchema: MOCK_TABLES_SCHEMA.items[0], loading: false });
  });

  it('As a developer, I can get access to the table schema via TableConsumer by table name and application name.', () => {
    renderer.create(
      <TableSchemaContext.Provider
        value={{ tablesList: MOCK_TABLES_SCHEMA.items, applicationsList: [], loading: false }}
      >
        <TableConsumer name="tableName" app="Salesforce">
          {testRenderFn}
        </TableConsumer>
      </TableSchemaContext.Provider>,
    );

    expect(testRenderFn).toHaveBeenCalledTimes(1);
    expect(testRenderFn).toHaveBeenCalledWith({ tableSchema: MOCK_TABLES_SCHEMA.items[1], loading: false });
  });

  it('As a developer, I can get access to the table schema via TableConsumer by table id.', () => {
    renderer.create(
      <TableSchemaContext.Provider
        value={{ tablesList: MOCK_TABLES_SCHEMA.items, applicationsList: [], loading: false }}
      >
        <TableConsumer id="1">{testRenderFn}</TableConsumer>
      </TableSchemaContext.Provider>,
    );

    expect(testRenderFn).toHaveBeenCalledTimes(1);
    expect(testRenderFn).toHaveBeenCalledWith({ tableSchema: MOCK_TABLES_SCHEMA.items[0], loading: false });
  });

  it('As a developer, I can get access to the table schema via useTablesList hook.', () => {
    const StubComponent = (props: any) => <div />;

    const TestComponent = () => {
      const { tablesList } = useTablesList();

      return <StubComponent tablesList={tablesList} />;
    };

    const testRenderer = renderer.create(
      <TableSchemaContext.Provider
        value={{ tablesList: MOCK_TABLES_SCHEMA.items, applicationsList: [], loading: false }}
      >
        <TestComponent />
      </TableSchemaContext.Provider>,
    );

    const testInstance = testRenderer.root;

    const { props } = testInstance.findByType(StubComponent);

    expect(props.tablesList).toEqual(MOCK_TABLES_SCHEMA.items);
  });
});
