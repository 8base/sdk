import React from 'react';
import { wrapDisplayName } from 'recompose';
import { Application } from '@8base/utils';
import { TableSchemaContext, ITableSchemaContext } from './TableSchemaContext';
import { Subtract } from 'utility-types';

export type WithApplicationsListProps = {
  applicationsList: Application[];
};

const withApplicationsList = <T extends WithApplicationsListProps>(WrappedComponent: React.ComponentType<T>) => {
  return class WithApplicationsList extends React.Component<Subtract<T, WithApplicationsListProps>> {
    public static displayName = wrapDisplayName(WrappedComponent, 'withTablesList');

    public renderContent = ({ applicationsList }: ITableSchemaContext) => (
      <WrappedComponent {...(this.props as T)} applicationsList={applicationsList} />
    );

    public render() {
      return <TableSchemaContext.Consumer>{this.renderContent}</TableSchemaContext.Consumer>;
    }
  };
};

export { withApplicationsList };
