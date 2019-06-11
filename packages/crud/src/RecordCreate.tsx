import React, { Component } from 'react';
import { MutationResult, MutationFn } from 'react-apollo';
import { TableConsumer } from '@8base/table-schema-provider';
import { TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { RecordCrud } from './RecordCrud';

interface IChildrenPropObject {
  tableMetaResult: TableSchema | null;
  mutateResult: MutationResult;
}

type RecordCreateProps = {
  tableName?: string;
  tableId?: string;

  children: (mutateFunction: MutationFn, result: IChildrenPropObject) => React.ReactNode;
};

/**
 * Component for creating the record of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(Function, ChildrenPropObject) => React.ReactNode} children - Render prop with result of the queries
 */
export class RecordCreate extends Component<RecordCreateProps> {
  public renderQuery = (tableMetaResult: TableSchema | null) => {
    const { children, ...rest } = this.props;

    if (!tableMetaResult) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    return (
      <RecordCrud {...rest} tableMeta={tableMetaResult} mode="create">
        {(mutateFunction, mutateResult) =>
          children(data => mutateFunction({ data }), {
            mutateResult,
            tableMetaResult,
          })
        }
      </RecordCrud>
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