import * as R from 'ramda';

import { FieldSchema } from '../types';

const isListField: (fieldSchema: FieldSchema) => boolean = R.propEq('isList', true);

export { isListField };
