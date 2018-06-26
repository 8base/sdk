// @flow
import * as R from 'ramda';

import type { FieldSchema, TableSchema } from '../types';

const sanitizeFieldName = (name: string): string => name.replace(/[\d[\]]+/g, '');

const getFieldSchema = (tableSchema: TableSchema, name: string): ?FieldSchema => R.find(
  R.propEq('name', sanitizeFieldName(name)),
  tableSchema.fields,
);

export { getFieldSchema };
