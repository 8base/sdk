// @flow
import React from 'react';
import { Field as FinalField } from 'react-final-form';
import { compose, setDisplayName } from 'recompose';
import createValidate from '@8base/validate';
import * as R from 'ramda';

import { withFieldSchema } from './utils';
import type { FieldProps } from './types';

/**
 * `Field` wrapper based on `Field` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FieldProps`](https://github.com/final-form/react-final-form#fieldprops) props and some extra props for easy working with 8base API.
 * @prop {FieldSchema} [fieldSchema] - The 8base API field schema.
 * @prop {string} [name] - The name of field, based on the 8base API table schema.
 */
class Field extends React.Component<FieldProps> {
  collectProps = R.pipe(
    R.when(
      R.has('fieldSchema'),
      ({ validate, ...rest }) => ({
        name: rest.name || rest.fieldSchema.name,
        validate: typeof validate === 'function' ? (...args) => validate(...args, createValidate(rest.fieldSchema)) : createValidate(rest.fieldSchema),
        ...rest,
      }),
    ),
    R.when(
      R.propIs(String, 'component'),
      R.dissoc('fieldSchema'),
    ),
  );

  render() {
    const collectedProps = this.collectProps(this.props);

    // $FlowFixMe: Waiting a new version of react-final-form with typing fix (https://github.com/final-form/react-final-form/pull/284)
    return <FinalField { ...collectedProps } />;
  }
}

Field = compose(
  withFieldSchema,
  setDisplayName('Field'),
)(Field);

export { Field };
