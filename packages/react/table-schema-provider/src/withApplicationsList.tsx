import React from 'react';
import { Application } from '@8base/utils';
import { getDisplayName } from '@8base-react/utils';
import { Subtract } from 'utility-types';

import { TableSchemaContext, ITableSchemaContext } from './TableSchemaContext';

export type WithApplicationsListProps = {
  applicationsList: Application[];
};

const withApplicationsList = <T extends WithApplicationsListProps>(WrappedComponent: React.ComponentType<T>) => {
  return class WithApplicationsList extends React.Component<Subtract<T, WithApplicationsListProps>> {
    public static displayName = `withApplicationsList(${getDisplayName<T>(WrappedComponent)})`;

    public renderContent = ({ applicationsList }: ITableSchemaContext) => (
      <WrappedComponent {...(this.props as T)} applicationsList={applicationsList} />
    );

    public render() {
      return <TableSchemaContext.Consumer>{this.renderContent}</TableSchemaContext.Consumer>;
    }
  };
};

export { withApplicationsList };
