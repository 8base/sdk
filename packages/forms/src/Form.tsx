import React from 'react';
import * as R from 'ramda';
import { FORM_ERROR } from 'final-form';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { compose, setDisplayName } from 'recompose';
import { FormProps as FinalFormProps } from 'react-final-form';
import { formatDataForMutation, formatDataAfterQuery, MUTATION_TYPE, FieldSchema } from '@8base/utils';
import errorCodes from '@8base/error-codes';
import { isAllowed } from '@8base/permissions-provider';

import { FormContext } from './FormContext';
import { withTableSchema, WithTableSchemaProps } from './utils';
import { FormProps, FormContextValue } from './types';

const enhancer: any = compose(
  withTableSchema,
  setDisplayName('Form'),
);

/**
 * `Form` wrapper based on `Form` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FormProps`](https://github.com/final-form/react-final-form#formprops) props and some extra props for easy working with 8base API.
 * @prop {TableSchema} [tableSchema] - The 8base API table schema.
 * @prop {string} [tableSchemaName] - The name of the 8base API table schema.
 */
const Form: React.ComponentType<FormProps> = enhancer(
  class Form extends React.Component<FormProps & WithTableSchemaProps> {
    public static defaultProps = {
      ignoreNonTableFields: true,
      mutators: {},
    };

    public collectProps = (): FinalFormProps => {
      const {
        mutators,
        tableSchema,
        type,
        schema,
        onSubmit,
        initialValues,
        onSuccess,
        ignoreNonTableFields,
        permissions,
        formatRelationToIds,
        ...restProps
      } = this.props;

      const collectedProps = {
        initialValues,
        mutators: R.merge(arrayMutators, mutators),
        onSubmit,
        tableSchema,
        ...restProps,
      };

      if (tableSchema && schema && type === MUTATION_TYPE.UPDATE && collectedProps.initialValues) {
        collectedProps.initialValues = formatDataAfterQuery({
          tableName: tableSchema.name,
          data: collectedProps.initialValues,
          schema,
          options: {
            formatRelationToIds,
          }
        });

        collectedProps.initialValuesEqual = R.equals;
      }

      const skipData = (value: any, fieldSchema: FieldSchema) =>
        !isAllowed(
          {
            field: fieldSchema.name,
            permission: type && type.toLowerCase(),
            resource: tableSchema && tableSchema.name,
            type: 'data',
          },
          permissions,
        );

      collectedProps.onSubmit = async (data, ...rest) => {
        let result = null;

        try {
          const formattedData =
            type && tableSchema && schema
              ? formatDataForMutation({
                type,
                tableName: tableSchema.name,
                data, schema,
                options: {
                  ignoreNonTableFields,
                  skip: permissions && skipData,
                }
              })
              : data;

          result = await onSubmit(formattedData, ...rest);
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
          // @ts-ignore
          onSuccess(result, ...rest);
        }
      };

      return collectedProps;
    };

    public collectContextValue = (): FormContextValue => {
      const { tableSchema } = this.props;

      return { tableSchema };
    };

    public render() {
      const props: FinalFormProps = this.collectProps();
      const contextValue: FormContextValue = this.collectContextValue();

      return (
        <FormContext.Provider value={contextValue}>
          <FinalForm {...props} />
        </FormContext.Provider>
      );
    }
  },
);

export { Form };
