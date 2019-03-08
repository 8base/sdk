// @flow

import { generateTable } from '../../src';
import { tablesSchema } from '../__fixtures__/tablesSchema';


it('should generate table by the table name', () => {
  const generatedTable = generateTable({
    tablesList: tablesSchema,
    tableName: 'Properties',
  });

  expect(generatedTable).toMatchSnapshot();
});

