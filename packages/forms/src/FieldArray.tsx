import React from 'react';
import R from 'ramda';
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
const FieldArray: React.ComponentType<FieldArrayProps> = enhacner(
  class FieldArray extends React.Component<FieldArrayProps & WithFieldSchemaProps> {
    collectProps = () => {
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
)

export { FieldArray };
