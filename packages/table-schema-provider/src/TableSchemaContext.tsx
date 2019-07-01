import React from 'react';
import { TableSchema, Application } from '@8base/utils';

export interface ITableSchemaContext {
  tablesList: TableSchema[];
  applicationsList: Application[];
  loading: boolean;
}

const TableSchemaContext = React.createContext<ITableSchemaContext>({
  tablesList: [],
  applicationsList: [],
  loading: false,
});

export { TableSchemaContext };
