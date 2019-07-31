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
  tableSchema: TableSchema;
  mode: CrudModes;
  includeColumns?: string[];

  children: (mutateFunction: MutationFn, mutateResult: MutationResult) => React.ReactNode;
};

const createRecordTag = (tableSchema: TableSchema, mode: CrudModes, options: QueryGeneratorConfig) => {
  switch (mode) {
    case 'create':
      return createTableRowCreateTag([tableSchema], tableSchema.id, options);
    case 'createMany':
      return createTableRowCreateManyTag([tableSchema], tableSchema.id);
    case 'update':
      return createTableRowUpdateTag([tableSchema], tableSchema.id, options);
    case 'delete':
      return createTableRowDeleteTag([tableSchema], tableSchema.id);
    default:
      return null;
  }
};

export class RecordCrud extends Component<RecordCrudProps> {
  public static contextType = PermissionsContext;

  public render() {
    const { tableSchema, children, mode, includeColumns, ...rest } = this.props;
    const mutation = gql(
      createRecordTag(tableSchema, mode, {
        permissions: this.context,
        includeColumns: includeColumns || null,
      }),
    );

    return (
      <Mutation {...rest} mutation={mutation}>
        {(mutateFunction: MutationFn, mutateResult: MutationResult) =>
          children(options => mutateFunction(options), mutateResult)
        }
      </Mutation>
    );
  }
}
