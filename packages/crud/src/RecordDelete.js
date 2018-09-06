// @flow
import React, { Component } from 'react';

import { TableMeta } from './TableMeta';
import { RecordCrud } from './RecordCrud';

interface ChildrenPropObject {
  tableMetaResult: Object,
  mutateResult: Object,
}

type RecordDeleteProps = {
  tableName?: string,
  tableId?: string,

  children: (mutateFunction: (id: string) => Promise<Object>, ChildrenPropObject) => React$Node,
}

/**
 * Component for deleting the record of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {string} recordId - Id of the record
 * @prop {(Function, ChildrenPropObject) => React$Node} children - Render prop with result of the queries
 */

export class RecordDelete extends Component<RecordDeleteProps> {
  render() {
    const { tableName, tableId, children, ...rest } = this.props;

    return (
      <TableMeta
        tableName={ tableName }
        tableId={ tableId }
      >
        { (tableMetaResult) => (
          <RecordCrud
            { ...rest }
            tableMeta={ tableMetaResult.data }
            mode="delete"
          >
            { (mutateFunction, mutateResult) =>
              children(
                (id: string) => mutateFunction({ id }),
                {
                  tableMetaResult,
                  mutateResult: mutateResult || {},
                }) }
          </RecordCrud>
        ) }
      </TableMeta>
    );
  }
}
