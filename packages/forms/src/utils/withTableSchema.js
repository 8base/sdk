// @flow
import React from 'react';

import { TableSchemaContext } from '@8base/table-schema-provider';
import { tablesListSelectors } from '@8base/utils';
import { logError } from './log';
import type { TableSchema, SchemaContextValue } from '../types';

type TableSchemaConsumerProps = {
  tableSchemaName?: string,
  appName?: string,
};

const withTableSchema = (BaseComponent: React$ComponentType<*>) => {
  class TableSchemaConsumer extends React.Component<TableSchemaConsumerProps> {
    renderWithSchema = ({ tablesList }: SchemaContextValue) => {
      const { tableSchemaName, appName, ...restProps } = this.props;

      if (tablesList && tableSchemaName) {
        const tableSchema: ?TableSchema = tablesListSelectors.getTableByName(tablesList, tableSchemaName, appName);

        if (tableSchema) {
          return <BaseComponent { ...restProps } tableSchema={ tableSchema } schema={ tablesList } />;
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
