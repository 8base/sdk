import React from 'react';
import { TableSchema } from '@8base/utils';
import { getDisplayName } from '@8base-react/utils';
import { Subtract } from 'utility-types';

import { TableSchemaContext, ITableSchemaContext } from './TableSchemaContext';

export type WithTablesListProps = {
  tablesList: TableSchema[];
};

const withTablesList = <T extends WithTablesListProps>(WrappedComponent: React.ComponentType<T>) => {
  return class WithTablesList extends React.Component<Subtract<T, WithTablesListProps>> {
    public static displayName = `withTablesList(${getDisplayName<T>(WrappedComponent)})`;

    public renderContent = ({ tablesList }: ITableSchemaContext) => (
      <WrappedComponent {...(this.props as T)} tablesList={tablesList} />
    );

    public render() {
      return <TableSchemaContext.Consumer>{this.renderContent}</TableSchemaContext.Consumer>;
    }
  };
};

export { withTablesList };
