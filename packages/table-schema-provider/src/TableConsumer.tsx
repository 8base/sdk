import React from 'react';
import { QueryResult } from 'react-apollo';
import { Schema, TableSchema } from '@8base/utils';
import * as selectors from './selectors';
import { TableSchemaContext } from './TableSchemaContext';

type TableConsumerProps = {
  id?: string;
  name?: string;
  children: (tableSchema: TableSchema | null) => React.ReactNode;
};

class TableConsumer extends React.Component<TableConsumerProps> {
  public renderWithSchemaResponse = (schema?: Schema) => {
    const { id, name, children } = this.props;

    let tableSchema: TableSchema | void | null = null;

    if (id) {
      tableSchema = selectors.tableList.getTableById(schema, id);
    } else if (name) {
      tableSchema = selectors.tableList.getTableByName(schema, name);
    }

    return children(tableSchema || null);
  };

  public render() {
    return <TableSchemaContext.Consumer>{this.renderWithSchemaResponse}</TableSchemaContext.Consumer>;
  }
}

export { TableConsumer };
