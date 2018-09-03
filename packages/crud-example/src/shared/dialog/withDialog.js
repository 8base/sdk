import React from 'react';

import { Consumer } from './DialogContext';

const withDialog = (BaseComponent) => {
  class DialogStateConsumer extends React.Component {
    renderBaseComponent = (dialogContext) => {
      const props = {
        ...this.props,
        openDialog: dialogContext.openDialog,
        closeDialog: dialogContext.closeDialog,
      };

      return <BaseComponent { ...props } />;
    }

    render() {
      return <Consumer>{ this.renderBaseComponent }</Consumer>;
    }
  }

  return DialogStateConsumer;
};

export { withDialog };
