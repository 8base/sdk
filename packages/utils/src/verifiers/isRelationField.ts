//@flow
import * as R from 'ramda';

import { FIELD_TYPE } from '../constants';
import type { FieldSchema } from '../types';

const isRelationField: (FieldSchema) => boolean = R.propEq('fieldType', FIELD_TYPE.RELATION);

export { isRelationField };
