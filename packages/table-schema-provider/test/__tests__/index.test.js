import React from 'react';
import renderer from 'react-test-renderer';

import { TableConsumer, TableSchemaContext } from '../../src';

const TABLES_SCHEMA = [{
  id: '1',
  name: 'tableName',
  fields: [],
}];

it('As a developer, I can get access to the table schema via TableConsumer by table name.', () => {
  const testRenderFn = jest.fn(() => <div />);

  renderer.create(
    <TableSchemaContext.Provider value={ TABLES_SCHEMA }>
      <TableConsumer name="tableName">
        { testRenderFn }
      </TableConsumer>
    </TableSchemaContext.Provider>,
  );

  expect(testRenderFn).toHaveBeenCalledTimes(1);
  expect(testRenderFn).toHaveBeenCalledWith(TABLES_SCHEMA[0]);
});

it('As a developer, I can get access to the table schema via TableConsumer by table id.', () => {
  const testRenderFn = jest.fn(() => <div />);

  renderer.create(
    <TableSchemaContext.Provider value={ TABLES_SCHEMA }>
      <TableConsumer id="1">
        { testRenderFn }
      </TableConsumer>
    </TableSchemaContext.Provider>,
  );

  expect(testRenderFn).toHaveBeenCalledTimes(1);
  expect(testRenderFn).toHaveBeenCalledWith(TABLES_SCHEMA[0]);
});
