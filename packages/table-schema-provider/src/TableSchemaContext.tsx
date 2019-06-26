import React from 'react';
import { TableSchema } from '@8base/utils';

export interface ITableSchemaContext {
  tablesList: TableSchema[];
  loading: boolean;
}

const TableSchemaContext = React.createContext<ITableSchemaContext>({
  tablesList: [],
  loading: false,
});

export { TableSchemaContext };
