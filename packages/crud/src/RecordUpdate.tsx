import React, { Component } from 'react';
import { TableConsumer, ITableConsumerRenderProps } from '@8base/table-schema-provider';
import { MutationFunction, MutationResult } from 'react-apollo';
import { TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { RecordCrud } from './RecordCrud';

/** Results of the record update queries and mutation */
interface IChildrenPropObject {
  tableSchema: TableSchema | null;
  mutateResult: MutationResult;
}

type RecordUpdateProps = {
  tableId?: string;
  recordId: string;
  includeColumns?: string[];
  children: (mutateFunction: MutationFunction, result: IChildrenPropObject) => JSX.Element;
};

/**
 * Component for updating the record of the table
 *
 * @prop {string} tableId - Id of the table
 * @prop {string} recordId - Id of the record
 * @prop {(Function, ChildrenPropObject) => React.ReactNode} children - Render prop with result of the queries
 */
export class RecordUpdate extends Component<RecordUpdateProps> {
  public renderQuery = ({ tableSchema, loading }: ITableConsumerRenderProps) => {
    const { tableId, children, recordId, includeColumns, ...rest } = this.props;

    if (!tableSchema && !loading) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    if (!tableSchema) {
      return null;
    }

    return (
      <RecordCrud {...rest} tableSchema={tableSchema} mode="update" includeColumns={includeColumns}>
        {(mutateFunction, mutateResult) =>
          children(mutateFunction, {
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
