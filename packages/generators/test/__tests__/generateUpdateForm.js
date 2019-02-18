// @flow

import { generateUpdateForm } from '../../src';
import { tablesSchema } from '../__fixtures__/tablesSchema';


it('should generate update form by the table name', () => {
  const generatedTable = generateUpdateForm(tablesSchema, 'Properties');

  expect(generatedTable).toMatchSnapshot();
});
