// @flow
import React, { PureComponent } from 'react';
import * as R from 'ramda';
import { ApolloProvider } from 'react-apollo';

import { getFragmentsSchema } from './schemaLoader';

type ApolloClient = *;

type AsyncApolloProviderState = {
  client: ?ApolloClient,
}

type AsyncApolloProviderProps = {
  children: React$Node,
  uri: string,
  getClient: (schema?: ?Object) => ?ApolloClient
}

/**
 * Provider fetch interfaces fragments schema and create apollo client
 * @property {React$Node} children Children of the provider
 * @property {string} uri children 8base endpoint
 * @property {Function} getClient 8base endpoint
 */
class AsyncApolloProvider extends PureComponent<AsyncApolloProviderProps, AsyncApolloProviderState> {
  state = {
    client: null,
  };

  async componentDidMount() {
    const { uri, getClient } = this.props;
    const schemaJson = await getFragmentsSchema(uri);
    const client = getClient(schemaJson);

    this.setState({ client });
  }

  render() {
    const { client } = this.state;
    const { children } = this.props;
    const isClientCreated = !R.isNil(client);

    return isClientCreated
      ? (
        <ApolloProvider client={ client }>
          { children }
        </ApolloProvider>
      )
      : null;
  }
}


export { AsyncApolloProvider };
