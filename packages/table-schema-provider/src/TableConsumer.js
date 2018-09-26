// @flow
import React from 'react';
import type { TableSchema } from '@8base/utils';

import { TableSchemaContext } from './TableSchemaContext';
import * as selectors from './selectors';

type TableConsumerProps = {
  id?: string,
  name?: string,
  children: (tableSchema: ?TableSchema) => React$Node,
};

class TableConsumer extends React.Component<TableConsumerProps> {
  renderWithTablesSchema = (tablesSchema: ?Array<TableSchema>) => {
    const { id, name, children } = this.props;

    let tableSchema = null;

    if (id) {
      tableSchema = selectors.tableList.getTableById(tablesSchema, id);
    } else if (name) {
      tableSchema = selectors.tableList.getTableByName(tablesSchema, name);
    }

    return children(tableSchema);
  }

  render() {
    return (
      <TableSchemaContext.Consumer>
        { this.renderWithTablesSchema }
      </TableSchemaContext.Consumer>
    );
  }
}


export { TableConsumer };
