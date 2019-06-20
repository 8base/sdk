import React from 'react';
import { TableSchema } from '@8base/utils';

export interface ITableSchemaContext {
  tablesList: TableSchema[];
}

const TableSchemaContext = React.createContext<ITableSchemaContext>({
  tablesList: [],
});

export { TableSchemaContext };
