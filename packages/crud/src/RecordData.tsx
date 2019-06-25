import React, { Component } from 'react';
import * as R from 'ramda';
import { Query, QueryResult } from 'react-apollo';
import gql from 'graphql-tag';
import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { PermissionsContext } from '@8base/permissions-provider';
import { createTableRowQueryTag, TableSchema } from '@8base/utils';

type RecordDataProps = {
  tableName?: string;
  tableId?: string;
  tableMeta: TableSchema;

  recordId: string;
  variables?: object;
  skip?: boolean;
  children: (recordData: QueryResult) => React.ReactNode;
};

export class RecordData extends Component<RecordDataProps> {
  public static contextType = PermissionsContext;

  public render() {
    const { tableName, tableId, variables, tableMeta, children, recordId, ...rest } = this.props;

    return (
      <Query
        {...rest}
        query={gql(createTableRowQueryTag([tableMeta], tableMeta.id, { permissions: this.context }))}
        variables={{ id: recordId }}
      >
        {({ data, ...rest }: QueryResult) =>
          children({
            ...rest,
            data: R.path([SchemaNameGenerator.getTableItemFieldName(tableMeta.name)], data),
          })
        }
      </Query>
    );
  }
}
