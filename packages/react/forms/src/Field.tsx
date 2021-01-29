import React, { useContext } from 'react';
import * as R from 'ramda';
import { Field as FinalField, FieldProps } from 'react-final-form';
import { createValidate } from '@8base/validate';
import { tableSelectors } from '@8base/utils';

import { FormContext } from './FormContext';
import { getFieldSchemaName } from './utils';

// @ts-ignore
const hackMultiple = (component) => ({ tempMultiple, ...props }) =>
  React.createElement(component, {
    ...props,
    multiple: tempMultiple,
  });

/**
 * `Field` wrapper based on `Field` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FieldProps`](https://github.com/final-form/react-final-form#fieldprops) props.
 */
const Field = (props: FieldProps<any, any>) => {
  const { tableSchema } = useContext(FormContext);

  if (tableSchema) {
    const fieldSchema = tableSelectors.getFieldByName(tableSchema, getFieldSchemaName(props.name));

    if (fieldSchema) {
      const fieldValidate = createValidate(fieldSchema);

      // Combine validation functions if needed
      if (typeof props.validate === 'function') {
        const { validate } = props;
        // @ts-ignore
        props = R.assoc('validate', (...args: any) => validate(...args, fieldValidate), props);
      } else {
        props = R.assoc('validate', fieldValidate, props);
      }

      // Provide field schema to non basic fields
      if (!R.propIs(String, 'component', props)) {
        props = R.assoc('fieldSchema', fieldSchema, props);
      }
    }
  }

  // Temp fix, waiting for update https://github.com/final-form/react-final-form/releases/tag/v6.3.1
  if (typeof props.component === 'function' && props.multiple) {
    props = R.assoc('tempMultiple', props.multiple, props);
    props = R.assoc('component', hackMultiple(props.component), props);
  }

  return <FinalField {...props} />;
};

export { Field };
