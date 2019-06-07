import React from 'react';
import { Subtract } from 'utility-types';

import { TableSchemaContext } from '@8base/table-schema-provider';
import { getTableSchema } from './getTableSchema';
import { logError } from './log';
import { Schema, TableSchema, SchemaContextValue } from '../types';

type TableSchemaConsumerProps = {
  tableSchemaName: string;
};

export type WithTableSchemaProps = {
  tableSchema?: TableSchema;
  schema?: Schema;
};

const withTableSchema = <T extends WithTableSchemaProps & TableSchemaConsumerProps>(
  WrappedComponent: React.ComponentType<Subtract<T, TableSchemaConsumerProps>>,
) => {
  return class TableSchemaConsumer extends React.Component<Subtract<T, WithTableSchemaProps>> {
    public renderWithSchema = (contextSchema?: SchemaContextValue) => {
      const { tableSchemaName, ...restProps } = this.props;

      if (contextSchema && tableSchemaName) {
        const tableSchema = getTableSchema(contextSchema, tableSchemaName);

        if (tableSchema) {
          return <WrappedComponent {...(restProps as T)} tableSchema={tableSchema} schema={contextSchema} />;
        }

        logError(`Error: schema doesn't contain table schema with ${tableSchemaName} name.`);
      }

      return <WrappedComponent {...(restProps as T)} />;
    };

    public render() {
      const { tableSchemaName, ...restProps } = this.props;

      if (tableSchemaName) {
        return <TableSchemaContext.Consumer>{this.renderWithSchema}</TableSchemaContext.Consumer>;
      }

      return <WrappedComponent {...(restProps as T)} />;
    }
  };
};

export { withTableSchema };
