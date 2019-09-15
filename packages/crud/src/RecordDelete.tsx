import React, { Component } from 'react';
import { MutationResult, MutationFunction } from 'react-apollo';
import { TableConsumer, ITableConsumerRenderProps } from '@8base/table-schema-provider';
import { TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

import { RecordCrud } from './RecordCrud';

interface IChildrenPropObject {
  tableSchema: TableSchema | null;
  mutateResult: MutationResult;
}

type RecordDeleteProps = {
  tableId?: string;

  children: (mutateFunction: MutationFunction, result: IChildrenPropObject) => JSX.Element;
};

/**
 * Component for deleting the record of the table
 *
 * @prop {string} tableId - Id of the table
 * @prop {string} recordId - Id of the record
 * @prop {(Function, ChildrenPropObject) => React.ReactNode} children - Render prop with result of the queries
 */

export class RecordDelete extends Component<RecordDeleteProps> {
  public renderQuery = ({ tableSchema, loading }: ITableConsumerRenderProps) => {
    const { children, ...rest } = this.props;

    if (!tableSchema && !loading) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    if (!tableSchema) {
      return null;
    }

    return (
      <RecordCrud {...rest} tableSchema={tableSchema} mode="delete">
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
