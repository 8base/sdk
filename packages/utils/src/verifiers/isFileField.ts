import * as R from 'ramda';

import { FIELD_TYPE } from '../constants';
import { FieldSchema } from '../types';

const isFileField: (fieldSchema: FieldSchema) => boolean = R.propEq('fieldType', FIELD_TYPE.FILE);

export { isFileField };
