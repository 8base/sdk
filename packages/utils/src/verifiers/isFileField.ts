//@flow
import * as R from 'ramda';

import { FIELD_TYPE } from '../constants';
import type { FieldSchema } from '../types';

const isFileField: (FieldSchema) => boolean = R.propEq('fieldType', FIELD_TYPE.FILE);

export { isFileField };
