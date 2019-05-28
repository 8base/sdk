import * as R from 'ramda';

import { TableSchema, Schema } from '../types';

const getTableSchemaById = (schema: Schema, id: string): TableSchema | void => R.find(
  R.propEq('id', id),
  schema,
);

export { getTableSchemaById };
