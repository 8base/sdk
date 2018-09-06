// @flow
import React, { Component } from 'react';
import * as R from 'ramda';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { TableMeta } from './TableMeta';
import { createTableFilterGraphqlTag } from './queryTableGenerator';

type RecordsListProps = {
  tableName?: string,
  tableId?: string,
  children: (recordsListResult: Object) => React$Node,
}

/**
 * Component for fetching the table content
 *
 * @prop {string} tableName - Name of the table
 * @prop {string} tableId - Id of the table
 * @prop {(recordsListResult: Object) => React$Node} children - Render prop with result of the query
 */
export class RecordsList extends Component<RecordsListProps> {

  render() {
    const { tableName, tableId, children, ...rest } = this.props;

    return (
      <TableMeta
        tableName={ tableName }
        tableId={ tableId }
      >
        { (tableMetaResult) => (
          <Query
            { ...rest }
            query={ gql(createTableFilterGraphqlTag(tableMetaResult.data)) }
          >
            { (recordsListResult) => children({
              ...recordsListResult,
              data: R.path(['data', 'tableContent'], recordsListResult),
            }) }
          </Query>
        ) }
      </TableMeta>
    );
  }
}
