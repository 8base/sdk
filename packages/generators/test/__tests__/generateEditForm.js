// @flow

import { generateEditForm } from '../../src';
import { tablesSchema } from '../__fixtures__/tablesSchema';


it('should generate update form by the table name', () => {
  const generatedEditForm = generateEditForm({
    tablesList: tablesSchema,
    tableName: 'Properties',
  });

  expect(generatedEditForm).toMatchSnapshot();
});
