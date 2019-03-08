// @flow

import { generateDeleteForm } from '../../src';
import { tablesSchema } from '../__fixtures__/tablesSchema';


it('should generate delete form by the table name', () => {
  const generatedTable = generateDeleteForm({
    tablesList: tablesSchema,
    tableName: 'Properties',
  });

  expect(generatedTable).toMatchSnapshot();
});
