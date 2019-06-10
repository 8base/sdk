import React, { Component } from 'react';
import { TableConsumer } from '@8base/table-schema-provider';
import { MutationFn, MutationResult, QueryResult } from 'react-apollo';
import { TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { RecordCrud } from './RecordCrud';
import { RecordData } from './RecordData';

/** Results of the record update queries and mutation */
interface IChildrenPropObject {
  tableMetaResult: TableSchema | null;
  recordDataResult: QueryResult;
  mutateResult: MutationResult;
}

type RecordUpdateProps = {
  tableName?: string;
  tableId?: string;
  recordId: string;

  children: (mutateFunction: MutationFn, result: IChildrenPropObject) => React.ReactNode;
};

/**
 * Component for updating the record of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {string} recordId - Id of the record
 * @prop {(Function, ChildrenPropObject) => React.ReactNode} children - Render prop with result of the queries
 */
export class RecordUpdate extends Component<RecordUpdateProps> {
  public renderQuery = (tableMetaResult: TableSchema | null) => {
    const { tableName, tableId, children, recordId, ...rest } = this.props;

    if (!tableMetaResult) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    return (
      <RecordData tableMeta={tableMetaResult} tableName={tableName} tableId={tableId} recordId={recordId}>
        {recordDataResult => (
          <RecordCrud {...rest} tableMeta={tableMetaResult} mode="update">
            {(mutateFunction, mutateResult) =>
              children(data => mutateFunction({ data, filter: { id: recordId } }), {
                mutateResult,
                recordDataResult,
                tableMetaResult,
              })
            }
          </RecordCrud>
        )}
      </RecordData>
    );
  };

  public render() {
    const { tableName, tableId } = this.props;

    return (
      <TableConsumer name={tableName} id={tableId}>
        {this.renderQuery}
      </TableConsumer>
    );
  }
}
