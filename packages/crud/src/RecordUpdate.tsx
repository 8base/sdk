import React, { Component } from 'react';
import { TableConsumer, ITableConsumerRenderProps } from '@8base/table-schema-provider';
import { MutationFn, MutationResult, QueryResult } from 'react-apollo';
import { TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { RecordCrud } from './RecordCrud';
import { RecordData } from './RecordData';

/** Results of the record update queries and mutation */
interface IChildrenPropObject {
  tableSchema: TableSchema | null;
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
  public renderQuery = ({ tableSchema, loading }: ITableConsumerRenderProps) => {
    const { tableName, tableId, children, recordId, ...rest } = this.props;

    if (!tableSchema && !loading) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    if (!tableSchema) {
      return null;
    }

    return (
      <RecordData tableSchema={tableSchema} tableName={tableName} tableId={tableId} recordId={recordId}>
        {recordDataResult => (
          <RecordCrud {...rest} tableSchema={tableSchema} mode="update">
            {(mutateFunction, mutateResult) =>
              children(data => mutateFunction({ data, filter: { id: recordId } }), {
                mutateResult,
                recordDataResult,
                tableSchema,
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
