import React, { Component } from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Query, QueryResult } from 'react-apollo';
import { TableConsumer } from '@8base/table-schema-provider';
import {
  createTableFilterGraphqlTag,
  TableSchema,
} from '@8base/utils';



type RecordsListFlattenData<T = object> = {
  items: T[],
  count: number,
}

type RecordsListData = {
  tableContent: RecordsListFlattenData
}

type RecordsListProps = {
  tableName?: string,
  tableId?: string,
  children: (recordsListResult: QueryResult<RecordsListFlattenData>) => React.ReactNode,
  deep?: number,
  relationItemsCount?: number,
}


/**
 * Component for fetching the table content
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(recordsListResult: Object) => React.ReactNode} children - Render prop with result of the query
 */
export class RecordsList extends Component<RecordsListProps> {
  isFetchingNewTable: boolean = false;

  componentDidUpdate(prevProps: RecordsListProps) {
    if (
      this.props.tableName !== prevProps.tableName ||
      this.props.tableId !== prevProps.tableId
    ) {
      this.startFetchingNewTable();
    }
  }

  startFetchingNewTable() {
    this.isFetchingNewTable = true;
  }

  stopFetchingNewTable() {
    this.isFetchingNewTable = false;
  }

  /** this dirty hack needs to avoid passing the old table data after changing the table */
  getRecordsListData = (recordsListResult: QueryResult<RecordsListData>) => {
    const recordsListData = this.isFetchingNewTable && recordsListResult.loading
      ? []
      : R.path(['data', 'tableContent'], recordsListResult);

    if (this.isFetchingNewTable && !recordsListResult.loading) {
      this.stopFetchingNewTable();
    }

    return recordsListData;
  }

  renderQuery = (tableMetaResult: TableSchema | null) => {
    const {
      children,
      deep,
      relationItemsCount,
      ...rest
    } = this.props;

    if (!tableMetaResult) {
      throw new Error('Table doesn\'t find');
    }

    const query = gql(
      createTableFilterGraphqlTag(
        [tableMetaResult],
        tableMetaResult.name,
        { tableContentName: 'tableContent', deep, relationItemsCount },
      ),
    );

    return (
      <Query
        { ...rest }
        query={ query }
      >
        {(recordsListResult: any) => children({
          ...recordsListResult,
          data: this.getRecordsListData(recordsListResult),
        }) }
      </Query>
    );
  };

  render() {
    const {
      tableName,
      tableId,
    } = this.props;

    return (
      <TableConsumer
        name={ tableName }
        id={ tableId }
      >
        { this.renderQuery }
      </TableConsumer>
    );
  }
}
