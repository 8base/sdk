// @flow
import React from 'react';
import * as R from 'ramda';
import { Field as FinalField } from 'react-final-form';
import { compose, setDisplayName } from 'recompose';
import createValidate from '@8base/validator';
import type { FieldProps as FinalFieldProps } from 'react-final-form';

import { withFieldSchema } from './utils';
import type { FieldProps } from './types';

/**
 * `Field` wrapper based on `Field` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FieldProps`](https://github.com/final-form/react-final-form#fieldprops) props and some extra props for easy working with 8base API.
 * @prop {FieldSchema} [fieldSchema] - The 8base API field schema.
 * @prop {string} [name] - The name of field, based on the 8base API table schema.
 */
class Field extends React.Component<FieldProps> {
  collectProps = (): FinalFieldProps => R.pipe(
    R.when(
      R.propIs(String, 'component'),
      R.dissoc ('fieldSchema'),
    ),
    R.assoc('validate', createValidate(this.props.fieldSchema)),
    R.assoc('name', this.props.name || this.props.name || this.props.fieldSchema.name),
  )(this.props);

  render() {
    const collectedProps = this.collectProps();

    // $FlowFixMe: Waiting a new version of react-final-form with typing fix (https://github.com/final-form/react-final-form/pull/284)
    return <FinalField { ...collectedProps } />;
  }
}

Field = compose(
  withFieldSchema,
  setDisplayName('Field'),
)(Field);

export { Field };
