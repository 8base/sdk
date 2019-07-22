import React, { useContext } from 'react';
import * as R from 'ramda';
import { FORM_ERROR } from 'final-form';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormProps as FinalFormProps } from 'react-final-form';
import { formatDataForMutation, formatDataAfterQuery, MUTATION_TYPE, FieldSchema } from '@8base/utils';
import errorCodes from '@8base/error-codes';
import { tablesListSelectors } from '@8base/utils';
import { TableSchemaContext, ITableSchemaContext } from '@8base/table-schema-provider';
import { isAllowed, PermissionsContext } from '@8base/permissions-provider';

import { FormContext } from './FormContext';
import { FormProps, FormContextValue } from './types';

/**
 * `Form` wrapper based on `Form` from the [`react-final-form`](https://github.com/final-form/react-final-form). That accept [`FormProps`](https://github.com/final-form/react-final-form#formprops) props and some extra props for easy working with 8base API.
 * @prop {string} [tableSchemaName] - The name of the 8base API table schema.
 * @prop {string} [appName] - The name of the 8base API application.
 */

const Form = ({
  type,
  tableSchemaName,
  appName,
  formatRelationToIds,
  ignoreNonTableFields,
  onSuccess,
  ...props
}: FormProps) => {
  const { tablesList, loading } = useContext(TableSchemaContext);
  const permissions = useContext(PermissionsContext);

  let tableSchema: any = null;

  if (tableSchemaName && tablesList) {
    tableSchema = tablesListSelectors.getTableByName(tablesList, tableSchemaName, appName);

    if (tableSchema && type === MUTATION_TYPE.UPDATE && props.initialValues) {
      props.initialValues = formatDataAfterQuery(
        props.initialValues,
        {
          tableName: tableSchema.name,
          schema: tablesList,
        },
        {
          formatRelationToIds,
        },
      );

      props.initialValuesEqual = R.equals;
    }

    // Provide field schema to non basic fields
    if (!R.propIs(String, 'component', props)) {
      props = R.assoc('tableSchema', tableSchema, props);
    }
  }

  props = R.assoc('loading', loading, props);

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

  // @ts-ignore
  props = R.evolve(
    {
      onSubmit: onSubmit => async (data: any, ...rest: any) => {
        let result = null;

        try {
          const formattedData =
            type && tableSchema && tablesList
              ? formatDataForMutation(
                  type,
                  data,
                  {
                    tableName: tableSchema.name,
                    schema: tablesList,
                  },
                  {
                    ignoreNonTableFields,
                    skip: permissions && skipData,
                  },
                )
              : data;

          // @ts-ignore
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
      },
    },
    props,
  );

  props.mutators = R.merge(arrayMutators, props.mutators);

  return (
    <FormContext.Provider value={{ tableSchema, loading }}>
      <FinalForm {...props} />
    </FormContext.Provider>
  );
};

Form.defaultProps = {
  ignoreNonTableFields: true,
  mutators: {},
};

export { Form };
