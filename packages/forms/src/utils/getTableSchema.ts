// @flow
import * as R from 'ramda';

import type { TableSchema, Schema } from '../types';

const getTableSchema = (schema: Schema, tableName: string): ?TableSchema => R.find(
  R.propEq('name', tableName),
  schema,
);

export { getTableSchema };
