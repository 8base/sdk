//@flow
import * as R from 'ramda';

import type { FieldSchema } from '../types';

const isMetaField: (FieldSchema) => boolean = R.propEq('isMeta', true);

export { isMetaField };
