// @flow
import React, { Component } from 'react';
import { TableConsumer } from '@8base/table-schema-provider';

import { RecordCrud } from './RecordCrud';
import { RecordData } from './RecordData';


/** Results of the record update queries and mutation */
interface ChildrenPropObject {
  tableMetaResult: Object,
  recordDataResult: Object,
  mutateResult: Object,
}

type RecordUpdateProps = {
  tableName?: string,
  tableId?: string,
  recordId: string,

  children: (mutateFunction: (Object) => Promise<Object>, ChildrenPropObject) => React$Node,
}

/**
 * Component for updating the record of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {string} recordId - Id of the record
 * @prop {(Function, ChildrenPropObject) => React$Node} children - Render prop with result of the queries
 */
export class RecordUpdate extends Component<RecordUpdateProps> {
  render() {
    const { tableName, tableId, children, recordId, ...rest } = this.props;

    return (
      <TableConsumer
        name={ tableName }
        id={ tableId }
      >
        { (tableMetaResult) => (
          <RecordData
            tableMeta={ tableMetaResult }
            tableName={ tableName }
            tableId={ tableId }
            recordId={ recordId }
          >
            { (recordDataResult) => (
              <RecordCrud
                { ...rest }
                tableMeta={ tableMetaResult }
                mode="update"
              >
                { (mutateFunction, mutateResult) =>
                  children(
                    (data) => mutateFunction({ data, filter: { id: recordId }}),
                    {
                      tableMetaResult,
                      recordDataResult,
                      mutateResult: mutateResult || {},
                    }) }
              </RecordCrud>
            ) }
          </RecordData>

        ) }
      </TableConsumer>
    );
  }
}
