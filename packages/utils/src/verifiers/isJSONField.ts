import * as R from 'ramda';

import { FIELD_TYPE } from '../constants';
import { FieldSchema } from '../types';

const isJSONField: (fieldSchema: FieldSchema) => boolean = R.propEq('fieldType', FIELD_TYPE.JSON);

export { isJSONField };
