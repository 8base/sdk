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
  collectProps = (): FinalFieldArrayProps => R.pipe(
    R.assoc('name', R.defaultTo(this.props.fieldSchema.name)(this.props.name)),
  )(this.props);

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
