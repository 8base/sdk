import React from 'react';
import * as R from 'ramda';
import { Field as FinalField, FieldProps as FinalFieldProps } from 'react-final-form';
import { compose, setDisplayName } from 'recompose';
import createValidate from '@8base/validate';

import { withFieldSchema, WithFieldSchemaProps } from './utils';
import { FieldProps } from './types';

const enhancer: any = compose(
  withFieldSchema,
  setDisplayName('Field'),
);

/**
 * `Field` wrapper based on `Field` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FieldProps`](https://github.com/final-form/react-final-form#fieldprops) props and some extra props for easy working with 8base API.
 * @prop {FieldSchema} [fieldSchema] - The 8base API field schema.
 * @prop {string} [name] - The name of field, based on the 8base API table schema.
 */
const Field: React.ComponentType<FinalFieldProps<any>> = enhancer(
  class Field extends React.Component<FieldProps & WithFieldSchemaProps> {
    public collectProps: any = R.pipe(
      R.when(R.has('fieldSchema'), ({ validate, ...rest }: any) => ({
        name: rest.name || rest.fieldSchema.name,
        validate:
          typeof validate === 'function'
            ? (...args: any) => validate(...args, createValidate(rest.fieldSchema))
            : createValidate(rest.fieldSchema),
        ...rest,
      })),
      R.when(R.propIs(String, 'component'), R.dissoc('fieldSchema')),
    );

    public render() {
      const collectedProps: FieldProps = this.collectProps(this.props);

      return <FinalField {...collectedProps} />;
    }
  },
);

export { Field };
