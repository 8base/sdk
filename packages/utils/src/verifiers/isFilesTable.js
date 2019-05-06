//@flow
import * as R from 'ramda';

import { SYSTEM_TABLES } from '../constants';
import type { TableSchema } from '../types';

const isFilesTable: TableSchema => boolean = R.propEq('name', SYSTEM_TABLES.FILES);

export { isFilesTable };
