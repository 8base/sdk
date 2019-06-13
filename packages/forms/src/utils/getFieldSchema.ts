import * as R from 'ramda';

import { FieldSchema, TableSchema } from '../types';

const getFieldSchema = (tableSchema: TableSchema, name: string): FieldSchema | void =>
  R.find(R.propEq('name', name), tableSchema.fields);

export { getFieldSchema };
