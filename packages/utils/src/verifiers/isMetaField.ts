import * as R from 'ramda';

import { FieldSchema } from '../types';

const isMetaField: (fieldSchema: FieldSchema) => boolean = R.propEq('isMeta', true);

export { isMetaField };
