import React, { Component } from 'react';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import gql from 'graphql-tag';
import {
  createTableRowCreateTag,
  createTableRowCreateManyTag,
  createTableRowUpdateTag,
  createTableRowDeleteTag,
  TableSchema,
  QueryGeneratorConfig,
} from '@8base/utils';
import { PermissionsContext } from '@8base/permissions-provider';

type CrudModes = 'create' | 'createMany' | 'update' | 'delete';

type RecordCrudProps = {
  tableMeta: TableSchema;
  mode: CrudModes;

  children: (
    mutateFunction: (args: { [key: string]: any }) => Promise<any>,
    mutateResult: MutationResult,
  ) => React.ReactNode;
};

const createRecordTag = (tableMeta: TableSchema, mode: CrudModes, options: QueryGeneratorConfig) => {
  switch (mode) {
    case 'create':
      return createTableRowCreateTag([tableMeta], tableMeta.name, options);
    case 'createMany':
      return createTableRowCreateManyTag([tableMeta], tableMeta.name);
    case 'update':
      return createTableRowUpdateTag([tableMeta], tableMeta.name, options);
    case 'delete':
      return createTableRowDeleteTag([tableMeta], tableMeta.name);
    default:
      return null;
  }
};

export class RecordCrud extends Component<RecordCrudProps> {
  public static contextType = PermissionsContext;

  public render() {
    const { tableMeta, children, mode, ...rest } = this.props;
    const mutation = gql(createRecordTag(tableMeta, mode, { permissions: this.context }));

    return (
      <Mutation {...rest} mutation={mutation}>
        {(mutateFunction: MutationFn, mutateResult: MutationResult) =>
          children(variables => mutateFunction({ variables }), mutateResult)
        }
      </Mutation>
    );
  }
}
