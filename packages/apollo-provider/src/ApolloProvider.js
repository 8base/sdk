// @flow
import React, { PureComponent } from 'react';
import * as R from 'ramda';
import { ApolloProvider as DefaultApolloProvider, type ApolloClient } from 'react-apollo';

import { getFragmentsSchema } from './schemaLoader';

type ApolloProviderState = {
  apolloClient: ?ApolloClient,
}

type ApolloProviderProps = {
  children: React$Node | ({ isLoading: boolean, apolloClient: ApolloClient }) => React$Node,
  uri: string,
  getClient: (schema?: ?Object) => ?ApolloClient,
}

/**
 * Provider fetch interfaces fragments schema and create apollo client
 * @property {React$Node | Function} children Children of the provider. Could be either react node or function with loading state.
 * @property {string} uri Children 8base endpoint
 * @property {Function} getClient 8base endpoint
 */
class ApolloProvider extends PureComponent<ApolloProviderProps, ApolloProviderState> {
  state = {
    apolloClient: null,
  };

  async componentDidMount() {
    const { uri, getClient } = this.props;
    const schemaJson = await getFragmentsSchema(uri);
    const apolloClient = getClient(schemaJson);

    this.setState({ apolloClient });
  }

  render() {
    const { apolloClient } = this.state;
    const { children } = this.props;
    const isClientCreated = !R.isNil(apolloClient);
    const isLoading = !isClientCreated;

    const rendered = typeof children === 'function'
      ? children({ isLoading, apolloClient })
      : children;

    return (
      <DefaultApolloProvider client={ apolloClient }>
        { rendered }
      </DefaultApolloProvider>
    );
  }
}


export { ApolloProvider };
