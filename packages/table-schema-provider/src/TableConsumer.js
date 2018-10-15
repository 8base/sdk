// @flow
import React from 'react';
import type { Schema, TableSchema } from '@8base/utils';

import { TableSchemaContext } from './TableSchemaContext';
import * as selectors from './selectors';

type TableConsumerProps = {
  id?: string,
  name?: string,
  children: (tableSchema: ?TableSchema) => React$Node,
};

class TableConsumer extends React.Component<TableConsumerProps> {
  renderWithSchemaResponse = (schema: ?Schema) => {
    const { id, name, children } = this.props;

    let tableSchema = null;

    if (id) {
      tableSchema = selectors.tableList.getTableById(schema, id);
    } else if (name) {
      tableSchema = selectors.tableList.getTableByName(schema, name);
    }

    return children(tableSchema);
  }

  render() {
    return (
      <TableSchemaContext.Consumer>
        { this.renderWithSchemaResponse }
      </TableSchemaContext.Consumer>
    );
  }
}


export { TableConsumer };
