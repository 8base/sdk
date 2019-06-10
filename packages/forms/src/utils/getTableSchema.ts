import R from 'ramda';

import { TableSchema, Schema } from '../types';

const getTableSchema = (schema: Schema, tableName: string): TableSchema | void =>
  R.find(R.propEq('name', tableName), schema);

export { getTableSchema };
