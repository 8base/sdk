import * as R from 'ramda';

import { SYSTEM_TABLES } from '../constants';
import { TableSchema } from '../types';

const isFilesTable: (tableSchema: TableSchema) => boolean = R.propEq('name', SYSTEM_TABLES.FILES);

export { isFilesTable };
