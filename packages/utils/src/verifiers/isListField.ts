//@flow
import * as R from 'ramda';

import type { FieldSchema } from '../types';

const isListField: (FieldSchema) => boolean = R.propEq('isList', true);

export { isListField };
