// @flow
import React, { Component } from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import * as tablesListSelectors from './tablesListSelectors';
import { type QueryResult } from './types';
import { TableFragment } from './fragments';


type TableMetaProps = {
  tableName?: string,
  tableId?: string,

  children: (tableMeta: QueryResult) => React$Node,
}

const TABLES_LIST_QUERY = gql`
  query TableMeta {
    tablesList {
      ...TableFragment
    }
  }

  ${TableFragment}
`;

export class TableMeta extends Component<TableMetaProps> {

  render() {
    const { tableName, tableId, children, ...rest } = this.props;

    return (
      <Query
        query={ TABLES_LIST_QUERY }
        { ...rest }
      >
        { (tablesListResult) => {
          const tablesList = R.pathOr([], ['data', 'tablesList'], tablesListResult);

          const tableMeta = tableName
            ? tablesListSelectors.getTableByName(tablesList, tableName)
            : tablesListSelectors.getTableById(tablesList, tableId);

          if (!tableName && !tableId) return null;
          if (!tableMeta) return null;
          if (!tableMeta && !tablesListResult.loading) throw Error('Table not found');

          return children({
            ...tablesListResult,
            data: tableMeta,
          });
        } }
      </Query>
    );
  }
}
