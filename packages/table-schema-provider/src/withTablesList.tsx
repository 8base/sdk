import React from 'react';
import { wrapDisplayName } from 'recompose';
import { TableSchema } from '@8base/utils';
import { TableSchemaContext, ITableSchemaContext } from './TableSchemaContext';
import { Subtract } from 'utility-types';

export type WithTablesListProps = {
  tablesList: TableSchema[];
};

const withTablesList = <T extends WithTablesListProps>(WrappedComponent: React.ComponentType<T>) => {
  return class WithTablesList extends React.Component<Subtract<T, WithTablesListProps>> {
    public static displayName = wrapDisplayName(WrappedComponent, 'withTablesList');

    public renderContent = ({ tablesList }: ITableSchemaContext) => (
      <WrappedComponent {...(this.props as T)} tablesList={tablesList} />
    );

    public render() {
      return <TableSchemaContext.Consumer>{this.renderContent}</TableSchemaContext.Consumer>;
    }
  };
};

export { withTablesList };
