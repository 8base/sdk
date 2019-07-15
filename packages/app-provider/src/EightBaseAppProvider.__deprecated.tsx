// @flow

import React from 'react';
import { AppProvider, AppProviderProps } from './AppProvider';

export class EightBaseAppProvider extends React.Component<AppProviderProps> {
  public componentDidMount() {
    // tslint:disable
    console.error(
      'DEPRECATION WARNING: EightBaseAppProvider has been renamed to AppProvider.',
    );
    // tslint:enabe
  }

  public render() {
    return <AppProvider {...this.props} />;
  }
}
