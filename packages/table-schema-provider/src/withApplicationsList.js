// @flow

import React from 'react';
import { wrapDisplayName } from 'recompose';
import type { Application } from '@8base/utils';
import { TableSchemaContext } from './TableSchemaContext';


export type ApplicationListProps = {
  applicationsList: Application[],
};

const withApplicationsList = <InputProps: ApplicationListProps> (
  WrappedComponent: React$ComponentType < InputProps >,
): Class <React$Component <$Diff<InputProps, ApplicationListProps>>> => {
  class withApplicationsList extends React.Component<$Diff<InputProps, ApplicationListProps>> {

    renderContent = ({ applicationsList }) => (
      <WrappedComponent
        { ...this.props }
        applicationsList={ applicationsList }
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

  withApplicationsList.displayName = wrapDisplayName(WrappedComponent, 'withApplicationsList');

  return withApplicationsList;
};

export { withApplicationsList };

