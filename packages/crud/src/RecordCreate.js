// @flow
import React, { Component } from 'react';

import { TableMeta } from './TableMeta';
import { RecordCrud } from './RecordCrud';


interface ChildrenPropObject {
  tableMetaResult: Object,
  mutateResult: Object,
}

type RecordCreateProps = {
  tableName?: string,
  tableId?: string,

  children: (mutateFunction: (Object) => Promise<Object>, ChildrenPropObject) => React$Node,
}

/**
 * Component for deleting the record of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(Function, ChildrenPropObject) => React$Node} children - Render prop with result of the queries
 */

/** Component for creating the record of the table */
export class RecordCreate extends Component<RecordCreateProps> {
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
            mode="create"
          >
            { (mutateFunction, mutateResult) =>
              children(
                mutateFunction,
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
