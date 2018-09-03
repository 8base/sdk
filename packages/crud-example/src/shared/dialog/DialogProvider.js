import React, { Component } from 'react';

import { Provider } from './DialogContext';

class DialogProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  openDialog = (id, args = {}) => {
    this.setState({
      [id]: {
        isOpen: true,
        args,
      },
    });
  };

  closeDialog = (id) => {
    this.setState({
      [id]: {
        isOpen: false,
      },
    });
  }

  collectContextValue = () => ({
    openDialog: this.openDialog,
    closeDialog: this.closeDialog,
    state: this.state,
  });

  render() {
    const contextValue = this.collectContextValue();

    return (
      <Provider value={ contextValue }>
        { this.props.children }
      </Provider>
    );
  }
}

export { DialogProvider };
