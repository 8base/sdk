// @flow
import React from 'react';
import * as R from 'ramda';
import { FORM_ERROR } from 'final-form';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { compose, setDisplayName } from 'recompose';
import type { FormProps as FinalFormProps } from 'react-final-form';
import { formatDataForMutation, formatDataAfterQuery, MUTATION_TYPE } from '@8base/utils';
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
    const { mutators, tableSchema, type, schema, onSubmit, initialValues, onSuccess, ...restProps } = this.props;

    const collectedProps = {
      mutators: R.merge(arrayMutators, mutators),
      tableSchema,
      onSubmit,
      initialValues,
      ...restProps,
    };

    if (tableSchema && schema && type === MUTATION_TYPE.UPDATE && collectedProps.initialValues) {
      collectedProps.initialValues = formatDataAfterQuery(tableSchema.name, collectedProps.initialValues, schema);
    }

    collectedProps.onSubmit = async (data, ...rest) => {
      let result = null;

      try {
        const fromattedData = (type && tableSchema && schema)
          ? formatDataForMutation(type, tableSchema.name, data, schema)
          : data;

        result = await onSubmit(fromattedData, ...rest);
      } catch (e) {
        result = R.assoc('errors', e.graphQLErrors, result);
      }

      const errors = R.pathOr([], ['errors'], result);

      if (errors.length > 0) {
        const error = errors[0];

        if (error.code === errorCodes.ValidationErrorCode) {
          return error.details;
        }

        return { [FORM_ERROR]: error.message };
      }

      if (typeof onSuccess === 'function') {
        onSuccess(result, ...rest);
      }
    };

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
