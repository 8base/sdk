import React, { Component } from 'react';
import { MutationResult, MutationFn } from 'react-apollo';
import { TableConsumer, ITableConsumerRenderProps } from '@8base/table-schema-provider';
import { TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { RecordCrud } from './RecordCrud';

interface IChildrenPropObject {
  tableSchema: TableSchema | null;
  mutateResult: MutationResult;
}

type RecordCreateProps = {
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
  public renderQuery = ({ tableSchema, loading }: ITableConsumerRenderProps) => {
    const { children, ...rest } = this.props;

    if (!tableSchema && !loading) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    if (!tableSchema) {
      return null;
    }

    return (
      <RecordCrud {...rest} tableSchema={tableSchema} mode="create">
        {(mutateFunction, mutateResult) =>
          children(data => mutateFunction({ data }), {
            mutateResult,
            tableSchema,
          })
        }
      </RecordCrud>
    );
  };

  public render() {
    const { tableId } = this.props;

    return <TableConsumer id={tableId}>{this.renderQuery}</TableConsumer>;
  }
}
