// @flow
import React from 'react';
import * as R from 'ramda';
import { FieldArray as FinalFieldArray } from 'react-final-form-arrays';
import { compose, setDisplayName } from 'recompose';
import type { FieldArrayProps as FinalFieldArrayProps } from 'react-final-form-arrays';

import { withFieldSchema } from './utils';
import type { FieldArrayProps } from './types';

/**
 * `FieldArray` wrapper based on `FieldArray` from the [`react-final-form-arrays`](https://github.com/final-form/react-final-form-arrays). It accepts [`FieldArrayProps`](https://github.com/final-form/react-final-form-arrays#fieldarrayprops) props.
 */
class FieldArray extends React.Component<FieldArrayProps> {
  collectProps = (): FinalFieldArrayProps => {
    const { fieldSchema, name, isEqual, ...restProps } = this.props;

    if (fieldSchema) {
      return {
        name: name || fieldSchema.name,
        fieldSchema,
        isEqual: isEqual || R.equals,
        ...restProps,
      };
    }

    return this.props;
  };

  render() {
    const collectedProps = this.collectProps();

    return <FinalFieldArray { ...collectedProps } />;
  }
}

FieldArray = compose(
  withFieldSchema,
  setDisplayName('FieldArray'),
)(FieldArray);

export { FieldArray };
