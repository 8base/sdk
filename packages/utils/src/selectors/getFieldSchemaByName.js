//@flow
import * as R from 'ramda';

import type { FieldSchema, TableSchema } from '../types';

const getFieldSchemaByName = (fieldName: string, tableSchema: TableSchema): ?FieldSchema => R.find(
  R.propEq('name', fieldName),
  tableSchema.fields,
);

export { getFieldSchemaByName };
