import * as R from 'ramda';

import { TableSchema, Schema } from '../types';

const getTableSchemaById = (id: string, schema: Schema): TableSchema | void => R.find(
  R.propEq('id', id),
  schema,
);

export { getTableSchemaById };
