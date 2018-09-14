import React from 'react';

import { Consumer } from './DialogContext';

const withDialogState = (BaseComponent) => {
  class DialogStateConsumer extends React.Component {
    renderBaseComponent = (dialogContext) => {
      const { id } = this.props;

      const props = {
        ...this.props,
        onClose: () => dialogContext.closeDialog(id),
        isOpen: dialogContext.state[id] ? dialogContext.state[id].isOpen : false,
        args: dialogContext.state[id] ? dialogContext.state[id].args : undefined,
      };

      return <BaseComponent { ...props } />;
    }

    render() {
      return <Consumer>{ this.renderBaseComponent }</Consumer>;
    }
  }

  return DialogStateConsumer;
};

export { withDialogState };
