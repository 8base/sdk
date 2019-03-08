// @flow

import { generateCreateForm } from '../../src';
import { tablesSchema } from '../__fixtures__/tablesSchema';


it('should generate create form by the table name', () => {
  const generatedTable = generateCreateForm({
    tablesList: tablesSchema,
    tableName: 'Properties',
  });

  expect(generatedTable).toMatchSnapshot();
});
