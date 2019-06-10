import R from 'ramda';

import { FieldSchema, TableSchema } from '../types';

const getFieldSchemaByName = (fieldName: string, tableSchema: TableSchema): FieldSchema | void =>
  R.find(R.propEq('name', fieldName), tableSchema.fields);

export { getFieldSchemaByName };
