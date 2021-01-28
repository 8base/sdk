import React from 'react';
import { TableSchema, Application } from '@8base/utils';
import { ApolloError } from '@apollo/client';

export interface ITableSchemaContext {
  tablesList: TableSchema[];
  applicationsList: Application[];
  loading: boolean;
  error?: ApolloError;
}

const TableSchemaContext = React.createContext<ITableSchemaContext>({
  tablesList: [],
  applicationsList: [],
  loading: false,
});

export { TableSchemaContext };
