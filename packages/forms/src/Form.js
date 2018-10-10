// @flow
import React from 'react';
import * as R from 'ramda';
import { FORM_ERROR } from 'final-form';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { compose, setDisplayName } from 'recompose';
import type { FormProps as FinalFormProps } from 'react-final-form';
import { formatDataForMutation } from '@8base/utils';
import errorCodes from '@8base/error-codes';

import { FormContext } from './FormContext';
import { withTableSchema } from './utils';
import type { FormProps, FormContextValue } from './types';

/**
 * `Form` wrapper based on `Form` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FormProps`](https://github.com/final-form/react-final-form#formprops) props and some extra props for easy working with 8base API.
 * @prop {TableSchema} [tableSchema] - The 8base API table schema.
 * @prop {string} [tableSchemaName] - The name of the 8base API table schema.
 */
class Form extends React.Component<FormProps> {
  static defaultProps = {
    mutators: {},
  };

  collectProps = (): FinalFormProps => {
    const { mutators, tableSchema, type, schema, onSubmit, ...restProps } = this.props;

    const collectedProps = {
      mutators: R.merge(arrayMutators, mutators),
      tableSchema,
      onSubmit,
      ...restProps,
    };

    if (type && tableSchema && schema) {
      collectedProps.onSubmit = async (data, ...rest) => {
        try {
          await onSubmit(formatDataForMutation(type, tableSchema.name, data, schema), ...rest);
        } catch (e) {
          if (e.graphQLErrors) {
            const error = e.graphQLErrors[0];

            if (error.code === errorCodes.ValidationErrorCode) {
              return error.details;
            }

            return { [FORM_ERROR]: error.message };
          }
        }
      };
    }

    return collectedProps;
  };

  collectContextValue = (): FormContextValue => {
    const { tableSchema } = this.props;

    return { tableSchema };
  };

  render() {
    const props: FinalFormProps = this.collectProps();
    const contextValue: FormContextValue = this.collectContextValue();

    return (
      <FormContext.Provider value={ contextValue }>
        <FinalForm { ...props } />
      </FormContext.Provider>
    );
  }
}

Form = compose(
  withTableSchema,
  setDisplayName('Form'),
)(Form);

export { Form };
