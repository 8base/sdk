import * as R from 'ramda';

import { TableSchema, Schema } from '../types';

const getTableSchemaByName = (tableName: string, schema: Schema): TableSchema | void => 
  R.find(
    R.propEq('name', tableName),
    schema,
  );

export { getTableSchemaByName };
