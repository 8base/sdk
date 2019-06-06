// @flow
import React from 'react';

import { TableSchemaContext } from '@8base/table-schema-provider';
import { getTableSchema } from './getTableSchema';
import { logError } from './log';
import type { TableSchema, SchemaContextValue } from '../types';

type TableSchemaConsumerProps = {
  tableSchemaName?: string,
};

const withTableSchema = (BaseComponent: React$ComponentType<*>) => {
  class TableSchemaConsumer extends React.Component<TableSchemaConsumerProps> {
    renderWithSchema = (contextSchema: ?SchemaContextValue) => {
      const { tableSchemaName, ...restProps } = this.props;

      if (contextSchema && tableSchemaName) {
        const tableSchema: ?TableSchema = getTableSchema(contextSchema, tableSchemaName);

        if (tableSchema) {
          return <BaseComponent { ...restProps } tableSchema={ tableSchema } schema={ contextSchema } />;
        }

        logError(`Error: schema doesn't contain table schema with ${tableSchemaName} name.`);
      }

      return <BaseComponent { ...restProps } />;
    }

    render() {
      const { tableSchemaName, ...restProps } = this.props;

      if (tableSchemaName) {
        return (
          <TableSchemaContext.Consumer>
            { this.renderWithSchema }
          </TableSchemaContext.Consumer>
        );
      }

      return <BaseComponent { ...restProps } />;
    }
  }

  return TableSchemaConsumer;
};

export { withTableSchema };
