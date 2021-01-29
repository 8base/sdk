import React from 'react';
import { TableSchema, tablesListSelectors } from '@8base/utils';
import { TableSchemaContext, ITableSchemaContext } from './TableSchemaContext';

export type ITableConsumerRenderProps =
  | {
      tableSchema: TableSchema | null;
      loading: false;
    }
  | {
      tableSchema: TableSchema | void;
      loading: true;
    };

export interface ITableConsumerProps {
  id?: string;
  app?: string;
  name?: string;
  children: (args: ITableConsumerRenderProps) => React.ReactNode;
}

class TableConsumer extends React.Component<ITableConsumerProps> {
  public renderWithSchemaResponse = ({ tablesList, loading }: ITableSchemaContext) => {
    const { id, name, app, children } = this.props;

    let tableSchema: TableSchema | void | null;

    if (id) {
      tableSchema = tablesListSelectors.getTableById(tablesList, id);
    } else if (name) {
      tableSchema = tablesListSelectors.getTableByName(tablesList, name, app);
    }

    return loading
      ? children({ tableSchema: tableSchema || undefined, loading })
      : children({ tableSchema: tableSchema || null, loading });
  };

  public render() {
    return <TableSchemaContext.Consumer>{this.renderWithSchemaResponse}</TableSchemaContext.Consumer>;
  }
}

export { TableConsumer };
