// @flow

import React from 'react';
import { wrapDisplayName } from 'recompose';
import type { TableSchema } from '@8base/utils';
import { TableSchemaContext } from './TableSchemaContext';


export type TablesListProps = {
  tablesList: TableSchema[],
};

const withTablesList = <InputProps: TablesListProps> (
  WrappedComponent: React$ComponentType < InputProps >,
): Class <React$Component <$Diff<InputProps, TablesListProps>>> => {
  class WithTablesList extends React.Component<$Diff<InputProps, TablesListProps>> {

    renderContent = ({ tablesList }) => (
      <WrappedComponent
        { ...this.props }
        tablesList={ tablesList }
      />
    )

    render() {
      return (
        <TableSchemaContext.Consumer>
          { this.renderContent }
        </TableSchemaContext.Consumer>
      );
    }
  }

  WithTablesList.displayName = wrapDisplayName(WrappedComponent, 'withTablesList');

  return WithTablesList;
};

export { withTablesList };

