// @flow
import React, { Component } from 'react';
import fp from 'lodash/fp';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import type { TableSchema } from '@8base/utils';
import { createTableRowQueryTag } from '@8base/utils';

import type { QueryResult } from './types';

type RecordDataProps = {
  tableName?: string,
  tableId?: string,
  tableMeta: TableSchema,

  recordId: string,
  variables?: Object,
  skip?: (Object) => boolean,
  children: (recordData: QueryResult) => React$Node,
}


export class RecordData extends Component<RecordDataProps> {

  render() {
    const { tableName, tableId, variables, tableMeta, children, recordId, ...rest } = this.props;

    return (
      <Query
        { ...rest }
        query={ gql(createTableRowQueryTag([tableMeta], tableMeta.name)) }
        variables={{ id: recordId }}
      >
        { ({ data, ...rest }) => children({
          ...rest,
          data: fp.get([SchemaNameGenerator.getTableItemFieldName(tableMeta.name)], data),
        }) }
      </Query>
    );
  }
}
