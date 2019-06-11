import React from 'react';
import { TableSchema, tablesListSelectors } from '@8base/utils';
import { TableSchemaContext, ITableSchemaContext } from './TableSchemaContext';

type TableConsumerProps = {
  id?: string;
  name?: string;
  app?: string;
  children: (tableSchema: TableSchema | null) => React.ReactNode;
};

class TableConsumer extends React.Component<TableConsumerProps> {
  public renderWithSchemaResponse = ({ tablesList }: ITableSchemaContext) => {
    const { id, name, app, children } = this.props;

    let tableSchema: TableSchema | void | null = null;

    if (id) {
      tableSchema = tablesListSelectors.getTableById(tablesList, id);
    } else if (name) {
      tableSchema = tablesListSelectors.getTableByName(tablesList, name, app);
    }

    return children(tableSchema || null);
  };

  public render() {
    return <TableSchemaContext.Consumer>{this.renderWithSchemaResponse}</TableSchemaContext.Consumer>;
  }
}

export { TableConsumer };
