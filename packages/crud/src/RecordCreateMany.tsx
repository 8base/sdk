// @flow
import React, { Component } from 'react';
import { TableConsumer } from '@8base/table-schema-provider';

import { RecordCrud } from './RecordCrud';


interface ChildrenPropObject {
  tableMetaResult: Object,
  mutateResult: Object,
}

type RecordCreateManyProps = {
  tableName?: string,
  tableId?: string,

  children: (mutateFunction: (Object) => Promise<Object>, ChildrenPropObject) => React$Node,
}

/**
 * Component for creating many records of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(Function, ChildrenPropObject) => React$Node} children - Render prop with result of the queries
 */
export class RecordCreateMany extends Component<RecordCreateManyProps> {
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
            mode="createMany"
          >
            { (mutateFunction, mutateResult) =>
              children(
                (data) => mutateFunction({ data }),
                {
                  tableMetaResult,
                  mutateResult: mutateResult || {},
                }) }
          </RecordCrud>
        ) }
      </TableConsumer>
    );
  }
}
