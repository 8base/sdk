// @flow
import * as R from 'ramda';

import type { FieldSchema, TableSchema } from '../types';

const getFieldSchema = (tableSchema: TableSchema, name: string): ?FieldSchema => R.find(
  R.propEq('name', name),
  tableSchema.fields,
);

export { getFieldSchema };
