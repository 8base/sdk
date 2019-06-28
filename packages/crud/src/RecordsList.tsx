import React, { Component } from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Query, QueryResult } from 'react-apollo';
import { TableConsumer, ITableConsumerRenderProps } from '@8base/table-schema-provider';
import { PermissionsContext } from '@8base/permissions-provider';
import { createTableFilterGraphqlTag, TableSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

type RecordsListFlattenData<T = object,> = {
  items: T[];
  count: number;
};

type RecordsListData = {
  tableContent: RecordsListFlattenData;
};

type RecordsListProps = {
  tableName?: string;
  tableId?: string;
  children: (recordsListResult: QueryResult<RecordsListFlattenData>) => React.ReactNode;
  deep?: number;
  relationItemsCount?: number;
};

/**
 * Component for fetching the table content
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(recordsListResult: object) => React.ReactNode} children - Render prop with result of the query
 */
export class RecordsList extends Component<RecordsListProps> {
  public static contextType = PermissionsContext;

  public isFetchingNewTable: boolean = false;

  public componentDidUpdate(prevProps: RecordsListProps) {
    if (this.props.tableName !== prevProps.tableName || this.props.tableId !== prevProps.tableId) {
      this.startFetchingNewTable();
    }
  }

  public startFetchingNewTable() {
    this.isFetchingNewTable = true;
  }

  public stopFetchingNewTable() {
    this.isFetchingNewTable = false;
  }

  /** this dirty hack needs to avoid passing the old table data after changing the table */
  public getRecordsListData = (recordsListResult: QueryResult<RecordsListData>) => {
    const recordsListData =
      this.isFetchingNewTable && recordsListResult.loading
        ? []
        : R.path(['data', 'tableContent'], recordsListResult) ||
          R.path(['data', 'appContent', 'tableContent'], recordsListResult);

    if (this.isFetchingNewTable && !recordsListResult.loading) {
      this.stopFetchingNewTable();
    }

    return recordsListData;
  };

  public renderQuery = ({ tableSchema, loading }: ITableConsumerRenderProps) => {
    const { children, deep, relationItemsCount, ...rest } = this.props;

    if (!tableSchema && !loading) {
      throw new SDKError(ERROR_CODES.TABLE_NOT_FOUND, PACKAGES.CRUD, `Table doesn't find`);
    }

    if (!tableSchema) {
      return null;
    }

    const query = gql(
      createTableFilterGraphqlTag([tableSchema], tableSchema.id, {
        deep,
        relationItemsCount,
        tableContentName: 'tableContent',
        appContentName: 'appContent',
        permissions: this.context,
      }),
    );

    return (
      <Query {...rest} query={query}>
        {(recordsListResult: any) =>
          children({
            ...recordsListResult,
            data: this.getRecordsListData(recordsListResult),
          })
        }
      </Query>
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
