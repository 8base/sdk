import React from 'react';
import * as R from 'ramda';
import { FieldArray as FinalFieldArray } from 'react-final-form-arrays';
import { compose, setDisplayName } from 'recompose';
import { FieldArrayProps } from 'react-final-form-arrays';

import { withFieldSchema, WithFieldSchemaProps } from './utils';

const enhacner: any = compose(
  withFieldSchema,
  setDisplayName('FieldArray'),
);

/**
 * `FieldArray` wrapper based on `FieldArray` from the [`react-final-form-arrays`](https://github.com/final-form/react-final-form-arrays). It accepts [`FieldArrayProps`](https://github.com/final-form/react-final-form-arrays#fieldarrayprops) props.
 */
const FieldArray: React.ComponentType<FieldArrayProps<any, any>> = enhacner(
  class FieldArray extends React.Component<FieldArrayProps<any, any> & WithFieldSchemaProps> {
    public collectProps = () => {
      const { fieldSchema, name, isEqual, ...restProps } = this.props;

      if (fieldSchema) {
        return {
          fieldSchema,
          isEqual: isEqual || R.equals,
          name: name || fieldSchema.name,
          ...restProps,
        };
      }

      return this.props;
    };

    public render() {
      const collectedProps = this.collectProps();

      return <FinalFieldArray {...collectedProps} />;
    }
  },
);

export { FieldArray };
