import React, { Component } from 'react';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import gql from 'graphql-tag';
import {
  createTableRowCreateTag,
  createTableRowCreateManyTag,
  createTableRowUpdateTag,
  createTableRowDeleteTag,
  TableSchema,
} from '@8base/utils';

type CrudModes = 'create' | 'createMany' | 'update' | 'delete'

type RecordCrudProps = {
  tableMeta: TableSchema,
  mode: CrudModes,

  children: (
    mutateFunction: (args: { [key: string ]: any }) => Promise<any>,
    mutateResult: MutationResult
  ) => React.ReactNode,
}

const createRecordTag = (tableMeta: TableSchema, mode: CrudModes) => {
  switch (mode) {
    case 'create': return createTableRowCreateTag([tableMeta], tableMeta.name);
    case 'createMany': return createTableRowCreateManyTag([tableMeta], tableMeta.name);
    case 'update': return createTableRowUpdateTag([tableMeta], tableMeta.name);
    case 'delete': return createTableRowDeleteTag([tableMeta], tableMeta.name);
    default: return null;
  }
};

export class RecordCrud extends Component<RecordCrudProps> {
  render() {
    const { tableMeta, children, mode, ...rest } = this.props;
    const mutation = gql(createRecordTag(tableMeta, mode));

    return (
      <Mutation
        { ...rest }
        mutation={ mutation }
      >
        {(mutateFunction: MutationFn, mutateResult: MutationResult) =>
          children(
            (variables) => mutateFunction({ variables }),
            mutateResult,
          ) }
      </Mutation>
    );
  }
}
