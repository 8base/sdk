// @flow
import React, { Component } from 'react';
import { TableConsumer } from '@8base/table-schema-provider';

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
 * Component for creating the record of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(Function, ChildrenPropObject) => React$Node} children - Render prop with result of the queries
 */
export class RecordCreate extends Component<RecordCreateProps> {
  render() {
    const { tableName, tableId, children, ...rest } = this.props;

    return (
      <TableConsumer
        name={ tableName }
        id={ tableId }
      >
        { (tableMetaResult) => (
          <RecordCrud
            { ...rest }
            tableMeta={ tableMetaResult }
            mode="create"
          >
            { (mutateFunction, mutateResult) =>
              children(
                (data) => mutateFunction({ data }),
                {
                  tableMetaResult,
                  mutateResult: mutateResult || {},
                },
              ) }
          </RecordCrud>
        ) }
      </TableConsumer>
    );
  }
}
