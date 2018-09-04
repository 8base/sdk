// @flow
import React from 'react';

import { TableSchemaContext } from '@8base/table-schema-provider';
import { getTableSchema } from './getTableSchema';
import { logError } from './logError';
import type { TableSchema, SchemaContextValue } from '../types';

type TableSchemaConsumerProps = {
  tableSchemaName?: string,
};

const withTableSchema = (BaseComponent: React$ComponentType<*>) => {
  class TableSchemaConsumer extends React.Component<TableSchemaConsumerProps> {
    renderWithSchema = (contextSchema: ?SchemaContextValue) => {
      const { tableSchemaName, ...restProps } = this.props;

      let rendered = null;

      if (contextSchema && tableSchemaName) {
        const tableSchema: ?TableSchema = getTableSchema(contextSchema, tableSchemaName);

        if (tableSchema) {
          rendered = <BaseComponent { ...restProps } tableSchema={ tableSchema } />;
        } else {
          logError(`Error: schema doesn't contain table schema with ${tableSchemaName} name.`);
        }
      } else {
        logError('Error: can\'t find schema in the schema context.');
      }

      return rendered;
    }

    render() {
      const { tableSchemaName, ...restProps } = this.props;

      let rendered = null;

      if (tableSchemaName) {
        rendered = <TableSchemaContext.Consumer>{ this.renderWithSchema }</TableSchemaContext.Consumer>;
      } else {
        rendered = <BaseComponent { ...restProps } />;
      }

      return rendered;
    }
  }

  return TableSchemaConsumer;
};

export { withTableSchema };
