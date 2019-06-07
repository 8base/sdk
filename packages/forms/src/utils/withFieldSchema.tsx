import React from 'react';
import { Subtract } from 'utility-types';

import { FormContext } from '../FormContext';
import { getFieldSchemaName } from './getFieldSchemaName';
import { getFieldSchema } from './getFieldSchema';
import { logWarning } from './log';
import { FieldSchema, FormContextValue } from '../types';

type FieldSchemaConsumerProps = {
  name?: string;
};

export type WithFieldSchemaProps = {
  fieldSchema?: FieldSchema;
};

const withFieldSchema = <T extends WithFieldSchemaProps & FieldSchemaConsumerProps>(
  WrappedComponent: React.ComponentType<Subtract<T, FieldSchemaConsumerProps>>,
) => {
  return class FieldSchemaConsumer extends React.Component<Subtract<T, WithFieldSchemaProps>> {
    public renderWithFormSchema = (context?: FormContextValue) => {
      const { name } = this.props;

      if (context && context.tableSchema && name) {
        const { tableSchema } = context;
        const fieldSchemaName = getFieldSchemaName(name);

        const fieldSchema = getFieldSchema(tableSchema, fieldSchemaName);

        if (fieldSchema) {
          return <WrappedComponent {...(this.props as T)} fieldSchema={fieldSchema} />;
        }

        logWarning(
          `table schema ${tableSchema &&
            tableSchema.name} doesn't contain field schema with \`${fieldSchemaName}\` name for \`${name}\` field.`,
        );
      }

      return <WrappedComponent {...(this.props as T)} />;
    };

    public render() {
      return <FormContext.Consumer>{this.renderWithFormSchema}</FormContext.Consumer>;
    }
  };
};

export { withFieldSchema };
