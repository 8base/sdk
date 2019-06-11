import * as R from 'ramda';

import { TableSchema, Schema } from '../types';

const getTableSchemaByName = (schema: Schema, tableName: string): TableSchema | void =>
  R.find(R.propEq('name', tableName), schema);

export { getTableSchemaByName };
