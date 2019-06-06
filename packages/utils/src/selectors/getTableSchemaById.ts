//@flow
import * as R from 'ramda';

import type { TableSchema, Schema } from '../types';

const getTableSchemaById = (schema: Schema, id: string): ?TableSchema => R.find(
  R.propEq('id', id),
  schema,
);

export { getTableSchemaById };
