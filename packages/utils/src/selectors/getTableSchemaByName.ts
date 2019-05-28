//@flow
import * as R from 'ramda';

import type { TableSchema, Schema } from '../types';

const getTableSchemaByName = (tableName: string, schema: Schema): ?TableSchema => R.find(
  R.propEq('name', tableName),
  schema,
);

export { getTableSchemaByName };
