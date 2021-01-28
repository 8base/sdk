import React, { useContext } from 'react';
import * as R from 'ramda';
import { FieldArray as FinalFieldArray, FieldArrayProps } from 'react-final-form-arrays';
import { tableSelectors } from '@8base/utils';

import { FormContext } from './FormContext';
import { getFieldSchemaName } from './utils';

/**
 * `FieldArray` wrapper based on `FieldArray` from the [`react-final-form-arrays`](https://github.com/final-form/react-final-form-arrays). It accepts [`FieldArrayProps`](https://github.com/final-form/react-final-form-arrays#fieldarrayprops) props.
 */
const FieldArray = (props: FieldArrayProps<any, any>) => {
  const { tableSchema } = useContext(FormContext);

  if (tableSchema) {
    const fieldSchema = tableSelectors.getFieldByName(tableSchema, getFieldSchemaName(props.name));

    if (fieldSchema) {
      props = {
        fieldSchema,
        isEqual: props.isEqual || R.equals,
        ...props,
      };
    }
  }

  return <FinalFieldArray {...props} />;
};

export { FieldArray };
