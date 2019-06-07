import React, { Component } from "react";
import { MutationResult, MutationFn } from "react-apollo";
import { TableConsumer } from "@8base/table-schema-provider";
import { TableSchema, SDKError, ERROR_CODES } from "@8base/utils";

import { RecordCrud } from "./RecordCrud";

interface ChildrenPropObject {
  tableMetaResult: TableSchema | null;
  mutateResult: MutationResult;
}

type RecordCreateManyProps = {
  tableName?: string;
  tableId?: string;

  children: (
    mutateFunction: MutationFn,
    result: ChildrenPropObject
  ) => React.ReactNode;
};

/**
 * Component for creating many records of the table
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(Function, ChildrenPropObject) => React.ReactNode} children - Render prop with result of the queries
 */
export class RecordCreateMany extends Component<RecordCreateManyProps> {
  renderQuery = (tableMetaResult: TableSchema | null) => {
    const { children, ...rest } = this.props;

    if (!tableMetaResult) {
      throw new SDKError(
        ERROR_CODES.TABLE_NOT_FOUND,
        '@8base/crud',
        `Table doesn't find`
      );
    }

    return (
      <RecordCrud {...rest} tableMeta={tableMetaResult} mode="createMany">
        {(mutateFunction, mutateResult) =>
          children(data => mutateFunction({ data }), {
            tableMetaResult,
            mutateResult
          })
        }
      </RecordCrud>
    );
  };

  render() {
    const { tableName, tableId } = this.props;

    return (
      <TableConsumer name={tableName} id={tableId}>
        {this.renderQuery}
      </TableConsumer>
    );
  }
}
