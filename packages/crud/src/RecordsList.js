// @flow
import React, { Component } from 'react';
import * as R from 'ramda';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { TableConsumer } from '@8base/table-schema-provider';
import {
  createTableFilterGraphqlTag,
  type TableSchema,
} from '@8base/utils';

type RecordsListProps = {
  tableName?: string,
  appName?: string,
  tableId?: string,
  children: (recordsListResult: Object) => React$Node,
  deep?: number,
  relationItemsCount?: number,
}


/**
 * Component for fetching the table content
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(recordsListResult: Object) => React$Node} children - Render prop with result of the query
 */
export class RecordsList extends Component<RecordsListProps> {
  isFetchingNewTable: boolean;
  isFetchingNewTable = false;

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
  getRecordsListData = (recordsListResult: Object) => {
    const recordsListData = this.isFetchingNewTable && recordsListResult.loading
      ? []
      : (
        R.path(['data', 'tableContent'], recordsListResult) ||
        R.path(['data', 'appContent', 'tableContent'], recordsListResult)
      );

    if (this.isFetchingNewTable && !recordsListResult.loading) {
      this.stopFetchingNewTable();
    }

    return recordsListData;
  }

  renderQuery = (tableMetaResult: TableSchema) => {
    const {
      children,
      deep,
      relationItemsCount,
      ...rest
    } = this.props;

    const query = gql(
      createTableFilterGraphqlTag(
        [tableMetaResult],
        tableMetaResult.id, {
          tableContentName: 'tableContent',
          appContentName: 'appContent',
          deep,
          relationItemsCount,
        }),
    );

    return (
      <Query
        { ...rest }
        query={ query }
      >
        { (recordsListResult) => children({
          ...recordsListResult,
          data: this.getRecordsListData(recordsListResult),
        }) }
      </Query>
    );
  };

  render() {
    const {
      tableName,
      appName,
      tableId,
    } = this.props;

    return (
      <TableConsumer
        name={ tableName }
        app={ appName }
        id={ tableId }
      >
        { this.renderQuery }
      </TableConsumer>
    );
  }
}
