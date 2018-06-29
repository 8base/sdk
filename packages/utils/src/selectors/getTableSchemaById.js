//@flow
import * as R from 'ramda';

import type { TableSchema, Schema } from '../types';

const getTableSchemaById = (id: string, schema: Schema): ?TableSchema => R.find(
  R.propEq('id', id),
  schema,
);

export { getTableSchemaById };
