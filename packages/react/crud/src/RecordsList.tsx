import React, { Component } from 'react';
import * as R from 'ramda';
import { QueryResult, gql } from '@apollo/client';
// TODO: apollo Query component is deprecated
import { Query } from '@apollo/client/react/components';
import { TableConsumer, ITableConsumerRenderProps } from '@8base-react/table-schema-provider';
import { PermissionsContext } from '@8base-react/permissions-provider';
import { createTableFilterGraphqlTag, TableSchema, FieldSchema, SDKError, ERROR_CODES, PACKAGES } from '@8base/utils';

type RecordsListFlattenData<T = object> = {
  items: T[];
  count: number;
};

type RecordsListData = {
  tableContent: RecordsListFlattenData;
};

type RecordsListProps = {
  tableId?: string;
  children: (recordsListResult: QueryResult<RecordsListFlattenData>) => JSX.Element;
  deep?: number;
  relationItemsCount?: number;
  filterFields?: (field: FieldSchema) => boolean;
};

/**
 * Component for fetching the table content
 *
 * @prop {string} tableId - Id of the table
 * @prop {(recordsListResult: object) => React.ReactNode} children - Render prop with result of the query
 */
export class RecordsList extends Component<RecordsListProps> {
  public static contextType = PermissionsContext;

  public isFetchingNewTable: boolean = false;

  public componentDidUpdate(prevProps: RecordsListProps) {
    if (this.props.tableId !== prevProps.tableId) {
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
    let recordsListData: object[] = [];

    if (this.isFetchingNewTable && recordsListResult.loading) {
      recordsListData = [];
    } else {
      recordsListData =
        R.path(['data', 'tableContent'], recordsListResult) ||
        R.path(['data', 'appContent', 'tableContent'], recordsListResult) ||
        [];
    }

    if (this.isFetchingNewTable && !recordsListResult.loading) {
      this.stopFetchingNewTable();
    }

    return recordsListData;
  };

  public renderQuery = ({ tableSchema, loading }: ITableConsumerRenderProps) => {
    const { children, deep, relationItemsCount, filterFields, ...rest } = this.props;

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
        permissions: this.context.permissions,
        filterFields,
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
    const { tableId } = this.props;

    return <TableConsumer id={tableId}>{this.renderQuery}</TableConsumer>;
  }
}
