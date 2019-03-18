// @flow

import { generateIndex } from '../../src';
import { tablesSchema } from '../__fixtures__/tablesSchema';


it('should generate table by the table name', () => {
  const generatedTable = generateIndex({
    tablesList: tablesSchema,
    tableName: 'Properties',
    screenName: 'Properties',
  });

  expect(generatedTable).toMatchSnapshot();
});

